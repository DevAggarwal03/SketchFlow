import { shapeType } from "@/components/Canvas";
import { clearCanvas, cursor, getExistingShapes, populateCursors, shape } from "./utils";


export async function canvasRect(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket | undefined, shapeRef: React.RefObject<shapeType>, usernameRef: React.RefObject<string>) {

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
            cursors.set(data.username, data.cursor);
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
    // const dx = 5;
    // const dy = 4;
    // const mouseScroll = (ev: WheelEvent) => {
    //     console.log(ev);
    //     if(ev.shiftKey){
    //         if(ev.deltaY > 0 || ev.deltaX > 0){
    //             canvas.width += dx;
    //             canvas.height += dy; 
    //             // ctx.transform()
    //             clearCanvas(ctx, canvas, existingShapes, linePoints);
    //             populateCursors(ctx, canvas, cursors);
    //         }else if(ev.deltaY < 0 || ev.deltaX < 0){
    //             canvas.width -= dx;
    //             canvas.height -= dy; 
    //             clearCanvas(ctx, canvas, existingShapes, linePoints);
    //             populateCursors(ctx, canvas, cursors);
    //         }
    //     }
    // }

    const handeDown = (e: MouseEvent) => {
        clicked = true;
        start.x = e.pageX;
        start.y = e.pageY;
        if(shapeRef.current == 'pencil'){
            linePoints.push({x: start.x, y: start.y});
            ctx.beginPath();
            ctx.moveTo(e.pageX, e.pageY)
        }
    }

    const handeup = (e: any) => {
        clicked = false;
        let msg: shape | {} = {};
        if(shapeRef.current == 'rect'){
            const width = e.pageX - start.x;
            const height = e.pageY - start.y;
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
            // const radius = (Math.sqrt(Math.pow((e.pageX - start.x), 2) + Math.pow((e.pageY - start.y), 2)))/2
            const a = e.pageX - start.x;
            const b = e.pageY - start.y;
            msg = {
                type: 'circle',
                center: {
                    x: start.x,
                    y: start.y,
                },
                dimensions: {
                    a: a,
                    b: b 
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
                x: e.pageX,
                y: e.pageY
            },
            //for now hardcoding the user id field
            username: usernameRef.current
        }
        socket.send(JSON.stringify({
            type: 'chat',
            message: JSON.stringify(mouseInfo),
            room: roomId
        }))
        if(clicked){
            if(shapeRef.current == 'rect'){
                const height = e.pageY - start.y;
                const width = e.pageX - start.x;

                clearCanvas(ctx, canvas, existingShapes, linePoints);
                populateCursors(ctx, canvas, cursors);
                
                ctx.strokeStyle = "white";
                ctx.strokeRect(start.x, start.y, width, height);
            }else if(shapeRef.current == 'circle'){
                // const center :{x: number, y: number} = {x : start.x + ((e.pageX - start.x)/2), y: start.y + ((e.pageY - start.y)/2)}; 
                const center: {x: number, y: number} = {x: start.x, y: start.y};
                // const radius = (Math.sqrt(Math.pow((e.pageX - start.x), 2) + Math.pow((e.pageY - start.y), 2)))/2
                const radius = (Math.sqrt(Math.pow((e.pageX - start.x), 2) + Math.pow((e.pageY - start.y), 2)));
                const a = e.pageX - start.x;
                const b = e.pageY - start.y;

                clearCanvas(ctx, canvas, existingShapes, linePoints);
                populateCursors(ctx, canvas, cursors);
                
                ctx.beginPath();
                ctx.strokeStyle = "white";
                // ctx.arc(center.x, center.y, radius, 0, 2*Math.PI);
                ctx.ellipse(center.x, center.y, Math.abs(a), Math.abs(b), 0, 0, 2*Math.PI);
                ctx.stroke();
            }else{
                const x = e.pageX;
                const y = e.pageY;
                const prevX = linePoints[linePoints.length - 1] ? linePoints[linePoints.length - 1].x : start.x;
                const prevY = linePoints[linePoints.length - 1] ? linePoints[linePoints.length - 1].y : start.y;
                
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
    // canvas.addEventListener('wheel', mouseScroll)

    return () => {
        canvas.removeEventListener('mousedown', handeDown)
        canvas.removeEventListener('mouseup', handeup)
        canvas.removeEventListener('mousemove', handeMove)
        // canvas.addEventListener('wheel', mouseScroll)
    } 
}