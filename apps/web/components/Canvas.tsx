'use client'

import { useSocket } from "@/hooks/useSocket";
import { canvasRect } from "../draw/canvasRect";
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import { canvasCircle } from "@/draw/canvasCirc";

export type shapeType = "rect" | "circle"

export default function Canvas({roomId}: {roomId: string}) {

    const [websocket, setWebsocket] = useState<WebSocket | undefined>(undefined);
    const [shape, setShape] = useState<shapeType>("rect");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shapeRef = useRef(shape);
    const socket = useSocket();

    const changeShapeType = (e: any) => {
        const {id} = e.target;
        console.log(id);
        if(id == '1'){
            setShape('rect');
            return;
        }
        setShape('circle');
        return;
    }

    useEffect(() => {
        shapeRef.current = shape;
    }, [shape]) 

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
            canvasRect(canvasRef.current, roomId, websocket, shapeRef);
        }

    }, [canvasRef, websocket, roomId])

    return <>
        <canvas ref={canvasRef} height={800} width={1450}></canvas>
        {
            websocket && <div className="absolute bg-white rounded-lg px-1 py-2 flex gap-y-2 flex-col left-2 bottom-[50%] translate-y-[50%] text-lg">
                <div onClick={changeShapeType} id="1">◾️</div>
                <div onClick={changeShapeType} id="2">⚫️</div>
            </div>
        }
        {
            !websocket && <div className="absolute top-4 right-4 text-white">connecting...</div>
        }
    </>
}