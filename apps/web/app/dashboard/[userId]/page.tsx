import Dashboard from "@/components/Dashboard"

export default async function DashboardPage({params}: {
    params: {
        userId: string
    }
}){
/*
    also add a logic to check if the user
    is logged in or not
*/
/*
    add logic to get all the details of the user
*/
    const userId = (await params).userId;
    return <Dashboard userId={userId}/> 
}
