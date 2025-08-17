'use client'

import { useEffect, useState } from "react";
import RoomInput from "./RoomInput";
import { http_url } from "@/config";
import axios from "axios";
import {getRoomType, roomType} from '@repo/types'
import RoomCard from "./RoomCard";



export default function Dashboard({userId}: {userId?:string}) {
    const [data, setData] = useState<getRoomType>();


    useEffect(() => {
        const url = http_url
        const token = localStorage.getItem('token');
        axios.get(`${url}/allRooms`,{
            headers: {
                authorization: `Bearer ${token}`
            },
        }).then(response => {
            if(!response || response.data.success == false){
                console.error(response);
            }

            console.log(response.data);
            setData(response.data); 
        })
    }, [])

    useEffect(() => {
        console.log(data?.rooms)
    }, [data])

    return <div className="gap-y-3 bg-black h-screen flex-col w-screen text-xl text-white flex justify-center items-center">
        <h1 className="pt-15 text-3xl">Welcome to <span className="text-blue-600">Sketch</span>Flow</h1>
        <div className="w-10/12 h-full flex justify-between items-center">
            <div className="w-8/12 flex flex-col justify-center items-center gap-y-3.5 text-3xl font-mono max-xl">
                <h1>Create A Room</h1>
                <RoomInput/>
            </div>
            <div className="w-8/12 flex flex-col justify-center items-center gap-y-3.5 text-3xl font-mono max-xl">
                <h1>Join A Room</h1>
                <RoomInput isCreate={false}/>
            </div>
        </div>
        <div className="text-white pb-10 flex gap-x-1.5 w-10/12 flex-wrap text-3xl">
            {
                data?.rooms.map((room, index: number) => {
                    console.log(room)
                    console.log(room.room['adminId'])
                    return <RoomCard key={index} room={room.room}/>
                })
            }
        </div>
    </div>


}