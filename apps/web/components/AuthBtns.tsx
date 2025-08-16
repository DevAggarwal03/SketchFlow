'use client'

import { Button } from "@/ui/button"
import { useRouter } from "next/navigation"

export default function AuthBtns(){
    const router = useRouter();
    const toSignIn = () => {
        router.push('/signIn');
    }
    const toSignUp = () => {
        router.push('/signUp');
    }
    return <>
        <Button onClick={toSignIn} variant="secondary">Sign In</Button>
        <Button onClick={toSignUp} variant="primary">Sign Up</Button>
    </>
}