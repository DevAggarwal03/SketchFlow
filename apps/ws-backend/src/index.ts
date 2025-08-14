import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken';
import {jwtContent} from '@repo/types'
import { contentInterface } from "./types/comm";

const wss = new WebSocketServer({port: 8081});

const roomConnection: Map<string, WebSocket[]>= new Map(); 
const onlineMember: Map<string, WebSocket> = new Map(); 


const broadcast = (msg: string, roomId: string, senderWs: WebSocket, user: JwtPayload) => {
    roomConnection.get(roomId)?.map((socket) => {
        if(socket && socket != senderWs){
            socket.send(msg);
        }
    })
    return;
}

wss.on('connection', (ws: WebSocket, request) => {
    const fullUrl = request.url;
    const token = fullUrl?.split('?')[1]?.split('=')[1];
    const decoded = token? jwt.verify(token, 'SECRET') : "";
    if(typeof decoded == "string"){
        ws.close();
        return;
    }
    if(!decoded || !decoded.userId){
        ws.close();
        return;
    }
    onlineMember.set(decoded.userId, ws);
    ws.on('message', (msg: string) => {
        const content: contentInterface = JSON.parse(msg);
        if(content.type == "join"){
            const arr: WebSocket[] = roomConnection.get(content.room) ?? [];
            roomConnection.set(content.room, [...arr, ws]);
        }else{
            broadcast(content.message || "", content.room, ws, decoded);
        }
    })
    ws.on('close', () => {
        onlineMember.delete(decoded.userId);
        ws.close();
        return;
    })
})
