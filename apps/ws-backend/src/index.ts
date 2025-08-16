import { WebSocketServer, WebSocket } from "ws";
import jwt from 'jsonwebtoken';
import { contentInterface } from "./types/comm";
import prisma from '@repo/db'

const wss = new WebSocketServer({port: 8081});

const roomConnection: Map<string, WebSocket[]>= new Map(); 
const onlineMember: Map<string, WebSocket> = new Map(); 

const verfiyUser = (token: string, ws: WebSocket) => {
    try {
        const decoded = token? jwt.verify(token, 'SECRET') : "";
        if(typeof decoded == "string"){
            ws.close();
            return null;
        }
    
        if(!decoded || !decoded.userId){
            ws.close();
            return null;
        }
        return decoded.userId
    } catch (error) {
        ws.close();
        return null
    } 
}

const broadcast = async (msg: string, roomId: string, senderWs: WebSocket) => {
    const isJoined = roomConnection.get(roomId)?.filter((socket) => socket == senderWs);
    if(isJoined?.length == 0){
        return;
    }
    console.log(roomConnection);
    roomConnection.get(roomId)?.forEach((socket) => {
        console.log("notSent");
        if(socket && socket != senderWs){
            console.log("sent");
            socket.send(msg);
        }
    })
    return;
}

wss.on('connection', (ws: WebSocket, request) => {
    const fullUrl = request.url;
    const token: string = fullUrl?.split('?')[1]?.split('=')[1] || "";

    const userId: string = verfiyUser(token, ws);

    onlineMember.set(userId, ws);

    ws.on('message', async(msg: string) => {
        const content: contentInterface = JSON.parse(msg);
        if(content.type == "join"){
            console.log(userId, "joined room", content);
            const arr: WebSocket[] | [] = roomConnection.get(content.room) ?? [];
            roomConnection.set(content.room, [...arr, ws]);
            return;
        }
        if(content.type == "chat"){
            await broadcast(content.message || "", content.room, ws);
            await prisma.chat.create({
                data: {
                    message: content.message ?? "",
                    roomId: content.room,
                    senderId: parseInt(userId),
                }
            })
            return;
        }
        if(content.type == "leave"){
            roomConnection.set(content.room, roomConnection.get(content.room)?.filter((socket: WebSocket) => socket != ws) || []);
            return;
        }
    })

    ws.on('close', () => {
        onlineMember.delete(userId);
        ws.close();
        return;
    })
})
