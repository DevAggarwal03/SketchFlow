import Canvas from "@/components/Canvas";


export default async function canvasPage({params}: {
    params: {
        roomId: string
    }
}) {
    //@ts-ignore
    const roomId = (params).roomId;

    return <div>
        <Canvas roomId={roomId}/>
    </div>
}