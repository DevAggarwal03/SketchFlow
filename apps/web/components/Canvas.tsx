'use client'

import { useSocket } from "@/hooks/useSocket";
import { canvasRect } from "../draw/canvasRect";
import React, { useEffect, useRef, useState } from "react"
import axios from "axios";
import { http_url } from "@/config";

export type shapeType = "rect" | "circle" | "pencil"

export default function Canvas({roomId}: {roomId: string}) {

    const [websocket, setWebsocket] = useState<WebSocket | undefined>(undefined);
    const [shape, setShape] = useState<shapeType>("rect");
    const [username, setUsername] = useState<string>('Anonymous');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shapeRef = useRef(shape);
    const socket = useSocket();
    const usernameRef = useRef<string>("Anonymous");
    const httpUrl = http_url;

    const changeShapeType = (e: any) => {
        const {id} = e.target;
        console.log(id);
        if(id == '1'){
            setShape('rect');
            return;
        }else if(id == '2'){
            setShape('circle');
            return;
        }
        setShape('pencil');
        return;
    }


    useEffect(() => {
        const token = localStorage.getItem('token');
        try {
            axios.post(`${httpUrl}/user`,{},{
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                console.log(res.data.username);
                setUsername(res.data.username);
            })
        } catch (error) {
            console.log(error);
        }
        return;
    }, [])

    useEffect(() => {
        shapeRef.current = shape;
    }, [shape]) 

    useEffect(() => {
        usernameRef.current = username;
    }, [username]) 

    useEffect(() => {
        if(!socket || socket == null || socket == undefined){
            // router.push('/');
            console.log('socket not connected');
            return;
        }

        socket.send(JSON.stringify({
            type: "join",
            room: roomId,
        }))
        setWebsocket(socket);
    }, [socket]) 

    useEffect(() => {
        if(canvasRef.current && websocket){
            canvasRect(canvasRef.current, roomId, websocket, shapeRef, usernameRef);
        }

    }, [canvasRef, websocket, roomId])

    return <>
        <canvas ref={canvasRef} className={`${shape == 'pencil' ? "cursor-pointer" : ""} `} height={window.innerHeight} width={window.innerWidth}></canvas>
        {
            websocket && <div className="fixed bg-white rounded-lg px-1 py-2 flex justify-center items-center gap-y-2 gap-x-4 left-[50%] top-2 translate-x-[-50%] text-lg">
                <div onClick={changeShapeType} className="text-2xl cursor-pointer" id="1">◾️</div>
                <div onClick={changeShapeType} id="2" className="cursor-pointer">⚫️</div>
                <div onClick={changeShapeType} className="text-xl text-black cursor-pointer" id="3">✐</div>
            </div>
        }
        {
            !websocket && <div className="absolute top-4 right-4 text-white">connecting...</div>
        }
    </>
}