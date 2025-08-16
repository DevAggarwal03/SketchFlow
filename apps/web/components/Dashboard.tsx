import { useEffect, useState } from "react";
import RoomInput from "./RoomInput";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";


export default function Dashboard() {

    // const router = useRouter();
    // const [websocket, setWebsocket] = useState<WebSocket>();
    // useEffect(() => {
    //     const token = localStorage.getItem('token') ?? "";
    //     if(token == ""){
    //        router.push('/'); 
    //     }
    //     const [socket] = useSocket(token);
    //     setWebsocket(socket);
    // }, [])


    // if(!websocket){
    //     return <div className="absolute top-4 right-4 text-white">connecting...</div>
    // }

    return <div className="gap-y-3 bg-black h-screen w-screen text-xl text-white flex justify-center items-center">
        <div className="w-8/12 flex flex-col justify-center items-center gap-y-3.5 text-3xl font-mono max-xl">
            <h1>Create a Room</h1>
            <RoomInput/>
        </div>
    </div>


}