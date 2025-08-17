import { http_url } from "@/config";
import { Button } from "@/ui/button";
import { roomType } from "@repo/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoomCard({room}: {room: roomType}) {

    const createdAt = new Date(room.createdAt);
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const httpUrl = http_url;

    useEffect(() => {
        axios.get(`${httpUrl}/user/${room.adminId}`).then((res) => {
            const usr = res.data.username
            setUsername(usr);
        })
    }, [])

    const submitHandeler = (e: React.MouseEvent) => {
        router.push(`/canvas/${room.id}`) 
    }

    return <div className="text-lg flex flex-col border gap-y-2 border-white rounded-lg p-2 max-w-[400px]">
        <div className="flex flex-col justify-center w-full">
            <div className="font-mono">Room Name: {room.slug}</div>
            <div className="font-mono">Admin: {username == '' ? room.adminId : username}</div>
            <div className="font-mono">Room Id: {room.id.slice(0, 3) + "..." + room.id.slice(-6)}</div>
            <div className="font-mono">Created At: {createdAt.getDate()+"-"+createdAt.getMonth()+"-"+createdAt.getFullYear()}</div>
        </div>
        <Button variant="primary" onClick={submitHandeler} className="font-mono">Join "{room.slug}"</Button>
    </div>
}