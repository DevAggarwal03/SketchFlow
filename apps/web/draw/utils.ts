import { shapeType } from "@/components/Canvas";
import { http_url } from "@/config";
import axios from "axios";

export type shape = {
    type: "rect",
    start: {x: number, y: number},
    dimensions: {w: number, h: number}
} | {
    type: "circle",
    center: {x: number, y: number},
    dimensions: {r: number}
}

export const clearCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: shape[]) => { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);   

    existingShapes.map((shape: shape) => {
        if(shape.type == 'rect'){
            ctx.strokeStyle = "white"
            ctx.strokeRect(shape.start.x, shape.start.y, shape.dimensions.w, shape.dimensions.h);
        }else{
            ctx.beginPath();
            ctx.strokeStyle = "white"
            ctx.arc(shape.center.x, shape.center.y, shape.dimensions.r, 0, 2*Math.PI);
            ctx.stroke();
        }
    })
}

export const getExistingShapes = async (roomId: string) => {
    const url = http_url;
    try {
        const response = await axios.get(`${url}/chats/${roomId}`);
        const data = response.data;
        const chats = data.chats;
        const shapes: shape[] = [];
        chats.forEach((chat: {message: string}) => {
            shapes.push(JSON.parse(chat.message))
        })
        console.log(shapes);
        return shapes       
    } catch (error) {
        
        console.log(error);
        return []
    }

}