import CredentialBox from "@/components/CredentialBox";

export default function signUp() {
    return <div className="h-screen w-screen flex justify-center items-center flex-col">
        <div className="flex w-10/12 justify-center items-center flex-col h-full">
            <div className="max-w-3xl mx-auto text-2xl  text-black font-bold mb-8">Sign In to <span className="text-fuchsia-600">Sketch Flow</span></div>
            <CredentialBox isSignIn={false}/>
        </div>
    </div>
}