'use client'

import { useEffect, useState } from "react"
import { Input } from "@/ui/input"
import { Button } from "@/ui/button";
import axios from "axios";
import { http_url } from "@/config";
import { useRouter } from "next/navigation";

export default function RoomInput({isCreate = true}: {isCreate? : boolean}) {
    const [slug, setSlug] = useState<string>("");
    const [token, setToken] = useState<string>("");

    const inputHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
    }
    const router = useRouter();

    useEffect(() => {
        const tkn = localStorage.getItem('token'); 
        if(tkn == null){
            alert('token not present signIn again');
            return
        }
        setToken(tkn)
    })

    const create = async (e: React.MouseEvent) => {
        const httpUrl = http_url
        const temp = slug.split(" ").join('_');
        console.log(httpUrl)
        try {
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

    const join = async (e: React.MouseEvent) => {
        try {
            const response = await axios.post(`${http_url}/joinRoom`, {
                slug: slug
            }, {
               headers: {
                    authorization: `Bearer ${token}`
               } 
            });
            console.log(response.data);
            if(response.data.success){
                //add a toast for success
                router.push(`/canvas/${response.data.id}`);
                return;
            }

            //add an error toast
            console.log(response.data.message);
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

        <Button variant="primary" className="font-sans" onClick={isCreate ? create : join}>{isCreate ? "Create Room" : "Join Room"}</Button>
    </div>
}