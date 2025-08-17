export interface jwtContent {
    userId: number,
    username: string,
}


export interface roomType {
    adminId: number,
    id: string,
    slug: string,
    createdAt: Date
}

export interface getRoomType {
    success: boolean,
    userId: number,
    username; string,
    rooms: [{
        room: roomType
    }] 
    adminOf: roomType[]
}