'use client'

import { ws_usl } from "../config";
import { useEffect, useState } from "react";

export const useSocket = () => {
    const wsUrl = ws_usl;
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token') ?? "";
        if (!token || token == "") {
            return; 
        }

        const newSocket = new WebSocket(`${wsUrl}?token=${token}`);

        newSocket.onopen = () => {
            console.log("Socket connected");
            setSocket(newSocket);
        };

        newSocket.onclose = () => {
            console.log("Socket disconnected");
            setSocket(null);
        };
        
        return () => {
            newSocket.close();
        };
    }, [wsUrl]);

    return socket; 
}