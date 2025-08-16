import { shapeType } from "@/components/Canvas";
import { clearCanvas, getExistingShapes } from "./utils";
import { shape } from "./utils";

export async function canvasCircle(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket | undefined, shape: shapeType) {

    const ctx = canvas.getContext('2d');
    if(!ctx || !socket){
    // if(!ctx){
        return;
    }

    console.log("after arc line")
    const existingShapes: shape[] = await getExistingShapes(roomId);

    // console.log(existingShapes);

    socket.onmessage = (ev: MessageEvent<any>) => {
        const data = JSON.parse(ev.data)
        // console.log(data);
        existingShapes.push(data)
        clearCanvas(ctx, canvas, existingShapes);
    }

    clearCanvas(ctx, canvas, existingShapes);

    let clicked = false;
    console.log(shape)
    let start: {x: number, y: number} = {x: 0, y:0};
    let dimensions: {r: number} = {r: 0};  
    canvas.addEventListener('mousedown', (e) => {
        clicked = true;
        start.x = e.clientX;
        start.y = e.clientY;
    })

    canvas.addEventListener('mouseup', (e) => {
        clicked = false;
        const radius = (Math.sqrt(Math.pow((e.clientX - start.x), 2) + Math.pow((e.clientY - start.y), 2)))/2
        const msg: shape = {
            type: 'circle',
            center: {
                x: start.x + ((e.clientX - start.x)/2),
                y: start.y + ((e.clientY - start.y)/2),
            },
            dimensions: {
                r: radius 
            }
        }
        existingShapes.push(msg);
        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(msg),
            room: roomId
        }))
    })

    canvas.addEventListener('mousemove', (e) => {
        if(clicked){
            
            const center :{x: number, y: number} = {x : start.x + ((e.clientX - start.x)/2), y: start.y + ((e.clientY - start.y)/2)}; 
            const radius = (Math.sqrt(Math.pow((e.clientX - start.x), 2) + Math.pow((e.clientY - start.y), 2)))/2

            clearCanvas(ctx, canvas, existingShapes);
            
            console.log('radius: ', dimensions.r)
            console.log(center)
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.arc(center.x, center.y, radius, 0, 2*Math.PI);
            ctx.stroke();
        }
    })
}


