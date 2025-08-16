import { shapeType } from "@/components/Canvas";
import { clearCanvas, getExistingShapes, shape } from "./utils";


export async function canvasRect(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket | undefined, shapeRef: React.RefObject<shapeType>) {

    const ctx = canvas.getContext('2d');
    if(!ctx || !socket){
        return;
    }

    const existingShapes: shape[] = await getExistingShapes(roomId);


    socket.onmessage = (ev: MessageEvent<any>) => {
        const data = JSON.parse(ev.data)
        existingShapes.push(data)
        clearCanvas(ctx, canvas, existingShapes);
    }

    clearCanvas(ctx, canvas, existingShapes);

    let clicked = false;

    let start: {x: number, y: number} = {x: 0, y:0};


    const handeDown = (e: any) => {
        clicked = true;
        start.x = e.clientX;
        start.y = e.clientY;
    }

    const handeup = (e: any) => {
        clicked = false;
        let msg: shape | {} = {};
        if(shapeRef.current == 'rect'){
            const width = e.clientX - start.x;
            const height = e.clientY - start.y;
            msg = {
                type: 'rect',
                start: {
                    x: start.x,
                    y: start.y,
                },
                dimensions: {
                    w: width,
                    h: height
                }
            }
        }else{
            const radius = (Math.sqrt(Math.pow((e.clientX - start.x), 2) + Math.pow((e.clientY - start.y), 2)))/2
            msg = {
                type: 'circle',
                center: {
                    x: start.x + ((e.clientX - start.x)/2),
                    y: start.y + ((e.clientY - start.y)/2),
                },
                dimensions: {
                    r: radius 
                }
            }
        }

        existingShapes.push(msg as shape)
        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(msg),
            room: roomId
        }))

    }

    const handeMove = (e: any) => {
        if(clicked){
            if(shapeRef.current == 'rect'){
                const height = e.clientY - start.y;
                const width = e.clientX - start.x;

                clearCanvas(ctx, canvas, existingShapes);
                
                ctx.strokeStyle = "white";
                ctx.strokeRect(start.x, start.y, width, height);
            }else{
                const center :{x: number, y: number} = {x : start.x + ((e.clientX - start.x)/2), y: start.y + ((e.clientY - start.y)/2)}; 
                const radius = (Math.sqrt(Math.pow((e.clientX - start.x), 2) + Math.pow((e.clientY - start.y), 2)))/2

                clearCanvas(ctx, canvas, existingShapes);
                
                console.log(center)
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.arc(center.x, center.y, radius, 0, 2*Math.PI);
                ctx.stroke();
            }
        }
    }

    canvas.addEventListener('mousedown', handeDown)

    canvas.addEventListener('mouseup', handeup)

    canvas.addEventListener('mousemove', handeMove)


    return () => {
        canvas.removeEventListener('mousedown', handeDown)
        canvas.removeEventListener('mouseup', handeup)
        canvas.removeEventListener('mousemove', handeMove)
    } 
}