'use client'

import { useState } from "react"
import { Input } from "@/ui/input"
import { Button } from "@/ui/button";
import axios from "axios";
import { http_url } from "@/config";
import { useRouter } from "next/navigation";

export default function RoomInput() {
    const [slug, setSlug] = useState<string>("")
    const inputHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
    }
    const router = useRouter();
    const create = async (e: React.MouseEvent) => {
        // const httpUrl = process.env.NEXT_PUBLIC_HTTP_URL;
        const httpUrl = http_url
        const token = localStorage.getItem(`token`);
        const temp = slug.split(" ").join('_');
        console.log(httpUrl)
        try {
            // const tempToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiRGV2QWdyMDMiLCJpYXQiOjE3NTUyNTAxODh9.2zR8WSeyR6W-ujvRQSPPu3gRU0Bv98UD8MteKZLgMUs"
            const response = await axios.post(`${httpUrl}/createRoom`,{
                slug: temp 
            }, {
                headers: {
                    authorization: `Bearer ${token}` 
                }
            })   
            console.log(response.data)
            if(response.data.success){
                router.push(`/canvas/${response.data.roomId}`)
            }
        } catch (error) {
            console.log(error); 
        }
    }
    return <div className="flex w-full flex-col justify-center items-center gap-y-2">
        <Input
         variant="primary" 
         id="slug" 
         size="md"
         type="text" 
         className="w-10/12 text-lg text-center max-w-[310px]"
         name="slug"
         value={slug}
         onChange={inputHandeler}
        />

        <Button variant="primary" className="font-sans" onClick={create}>Create Room</Button>
    </div>
}