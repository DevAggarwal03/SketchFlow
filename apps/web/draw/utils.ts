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
} | {
    type: 'pencil',
    start: {
        x: number,
        y: number
    }
    dimensions: {
        x: number,
        y: number
    }[]
}

export interface cursor {
    x: number,
    y: number 
}

export const clearCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: shape[], linePoints: {x: number, y: number}[]) => { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);   

    existingShapes.map((shape: shape) => {
        if(shape.type == 'rect'){
            ctx.strokeStyle = "white"
            ctx.strokeRect(shape.start.x, shape.start.y, shape.dimensions.w, shape.dimensions.h);
        }else if(shape.type == 'circle'){
            ctx.beginPath();
            ctx.strokeStyle = "white"
            ctx.arc(shape.center.x, shape.center.y, shape.dimensions.r, 0, 2*Math.PI);
            ctx.stroke();
        }else{
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.moveTo(shape.start.x, shape.start.y);
            shape.dimensions.forEach((value: {x: number, y: number}) => {
                ctx.lineTo(value.x, value.y);
            })
            ctx.stroke();
        }
    })

    if(linePoints.length != 0){
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(linePoints[0].x, linePoints[0].y)
        linePoints.forEach((point:{x: number, y: number}) => {
            ctx.lineTo(point.x, point.y);
        })
        ctx.stroke();
    }
}

export const getExistingShapes = async (roomId: string) => {
    const url = http_url;
    try {
        const response = await axios.get(`${url}/chats/${roomId}`);
        const data = response.data;
        const chats = data.chats;
        const shapes: shape[] = [];
        chats.forEach((chat: {message: string}) => {
            if(!chat.message.includes('mouseMove')){
                shapes.push(JSON.parse(chat.message))
            }
        })
        console.log(shapes);
        return shapes       
    } catch (error) {
        
        console.log(error);
        return []
    }

}

export const populateCursors = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, cursors: Map<string, cursor>) => {
    cursors.forEach((value: cursor, key: string) => {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        
        const cursorSvg = new Image();

        cursorSvg.src = dataUrlCursor('green');
        
        cursorSvg.onload = (e) => {
            ctx.drawImage(cursorSvg, value.x, value.y);   
        }

        ctx.fillStyle = 'green'
        ctx.font = 'bold 18px "Times-Roman"'
        ctx.fillText(key, value.x - 20, value.y + 40, 130);
        ctx.fill();
    })

}

export const dataUrlCursor = (color: string) => {
    const svg = `
    <svg 
      fill="${color}" 
      width="24px" 
      height="24px" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg" 
      transform="matrix(-1, 0, 0, 1, 0, 0)"
    >
      <path d="M20.8,9.4,4.87,2.18A2,2,0,0,0,2.18,4.87h0L9.4,20.8A2,2,0,0,0,11.27,22h.25a2.26,2.26,0,0,0,2-1.8l1.13-5.58,5.58-1.13a2.26,2.26,0,0,0,1.8-2A2,2,0,0,0,20.8,9.4Z"></path>
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`
}