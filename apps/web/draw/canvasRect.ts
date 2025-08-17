import { shapeType } from "@/components/Canvas";
import { clearCanvas, cursor, getExistingShapes, populateCursors, shape } from "./utils";


export async function canvasRect(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket | undefined, shapeRef: React.RefObject<shapeType>) {

    const ctx = canvas.getContext('2d');
    if(!ctx || !socket){
        return;
    }

    const existingShapes: shape[] = await getExistingShapes(roomId);
    let cursors: Map<string, cursor> = new Map();
    let linePoints: {x: number, y: number}[] = []; 

    socket.onmessage = (ev: MessageEvent<any>) => {
        const data = JSON.parse(ev.data)
        if(data.type == 'mouseMove'){
            cursors.set(data.userId, data.cursor);
        }else{
            existingShapes.push(data)
        }
        clearCanvas(ctx, canvas, existingShapes, linePoints);
        populateCursors(ctx, canvas, cursors);
    }

    clearCanvas(ctx, canvas, existingShapes, linePoints);
    populateCursors(ctx, canvas, cursors);

    let clicked = false;

    let start: {x: number, y: number} = {x: 0, y:0};

    const handeDown = (e: MouseEvent) => {
        clicked = true;
        start.x = e.clientX;
        start.y = e.clientY;
        if(shapeRef.current == 'pencil'){
            linePoints.push({x: start.x, y: start.y});
            // ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY)
        }
        console.log(shapeRef.current);
        
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
        }else if(shapeRef.current == 'circle'){
            const radius = (Math.sqrt(Math.pow((e.clientX - start.x), 2) + Math.pow((e.clientY - start.y), 2)))/2
            // console.log("radius: ", radius)
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
        }else{
            
            msg = {
                type: 'pencil',
                start: {x: start.x, y: start.y},
                dimensions: linePoints
            }
            linePoints = [];
        }

        existingShapes.push(msg as shape)
        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(msg),
            room: roomId
        }))

    }

    const handeMove = (e: MouseEvent) => {
        const mouseInfo = {
            type: 'mouseMove',
            cursor: {
                x: e.clientX,
                y: e.clientY
            },
            //for now hardcoding the user id field
            userId: "123"
        }
        socket.send(JSON.stringify({
            type: 'chat',
            message: JSON.stringify(mouseInfo),
            room: roomId
        }))
        if(clicked){
            if(shapeRef.current == 'rect'){
                const height = e.clientY - start.y;
                const width = e.clientX - start.x;

                clearCanvas(ctx, canvas, existingShapes, linePoints);
                populateCursors(ctx, canvas, cursors);
                
                ctx.strokeStyle = "white";
                ctx.strokeRect(start.x, start.y, width, height);
            }else if(shapeRef.current == 'circle'){
                const center :{x: number, y: number} = {x : start.x + ((e.clientX - start.x)/2), y: start.y + ((e.clientY - start.y)/2)}; 
                const radius = (Math.sqrt(Math.pow((e.clientX - start.x), 2) + Math.pow((e.clientY - start.y), 2)))/2

                clearCanvas(ctx, canvas, existingShapes, linePoints);
                populateCursors(ctx, canvas, cursors);
                
                console.log(center)
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.arc(center.x, center.y, radius, 0, 2*Math.PI);
                ctx.stroke();
            }else{
                const x = e.clientX;
                const y = e.clientY;
                const prevX = linePoints[linePoints.length - 1] ? linePoints[linePoints.length - 1].x : start.x;
                const prevY = linePoints[linePoints.length - 1] ? linePoints[linePoints.length - 1].y : start.y;
                console.log(prevX, prevY)
                
                clearCanvas(ctx, canvas, existingShapes, linePoints);
                populateCursors(ctx, canvas, cursors);
                
                ctx.strokeStyle = 'white'
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
                linePoints.push({x, y});
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