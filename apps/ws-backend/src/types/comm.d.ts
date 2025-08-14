export interface contentInterface {
    userId: number
    type: "join" | "chat",
    room: string,
    message? : string
}