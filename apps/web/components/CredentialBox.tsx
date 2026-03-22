'use client'

import { http_url } from "@/config";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input"
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react"


export default function CredentialBox({
    isSignIn
}: {
    isSignIn: boolean
}){
    const [details, setDetails] = useState({username: "", password: ""});
    const [message, setMessage] = useState<string | undefined>()
    const router = useRouter();

    const inputHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setDetails(prev => ({
            ...prev,
            [name]: value
        }))

    }
    
    const submitHandeler = async (e: React.MouseEvent) => {
        const endPoint = isSignIn ? "signIn" : "signUp";
        const url = http_url;
        try {
            const response = await axios.post(`${url}/${endPoint}`, {
                username: details.username,
                password: details.password
            })
            if(response.status == 404){
                console.log("hi")
                setMessage("user not found!");
                return;
            }
            if(response.data.success){
                if(response.data.token){
                    localStorage.setItem("token", response.data.token);
                    router.push(`/dashboard/${response.data.userId}`)
                }else{
                    alert('singIn again!')
                    router.push('/signIn')
                }
                console.log(response.data.userId);
            }else{
                alert(response.data.message);
            }
            return;
        } catch (error) {
            if(error instanceof AxiosError){
                setMessage(error.response?.data.message);
            }else{
                setMessage('something went wrong try again later!')
            }
        }
        e.preventDefault();
    }
    return <div className="w-full flex flex-col gap-y-2.5 justify-center items-center">
        <Input size="md" placeholder="username" id="username" name="username" type="text" variant="primary" value={details.username} className="w-6/12 max-w-[400px]" onChange={inputHandeler}/>
        <Input size="md" placeholder="password" id="password" name="password" type="password" variant="primary" value={details.password} className="w-6/12 max-w-[400px]" onChange={inputHandeler}/>
        <Button variant="primary" onClick={submitHandeler}>{isSignIn ? 'sign in' : 'sign out'}</Button>
        {
            message && <div className="text-lg text-red-500">{message}</div>
        }
    </div>
}