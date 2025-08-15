export interface contentInterface {
    userId: number
    type: "join" | "chat" | "leave",
    room: string,
    message? : string
}