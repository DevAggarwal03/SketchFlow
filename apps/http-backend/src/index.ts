import express from 'express'
import jwt from 'jsonwebtoken' 
import { middleware } from './middleware';
import {jwtContent} from "@repo/types"
import prisma from "@repo/db"
import {v4 as uuidv4} from 'uuid'
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));

app.post('/signUp', async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await prisma.user.create({
            data:{
                username,
                password
            }
        })

        if(user == null){
            res.status(500).json({
                success: false,
                message: "try again later"
            })
        }

        res.status(200).json({
            success: true,
            userId: user.id,
            message: "signed In successfully"
        })
    } catch (error) {
        res.status(402).json({
            success: false,
            message: "something went wrong" 
        })
    }
})



app.post('/signIn', async (req, res) => {
    const {username, password} = req.body;
    try {
        
        const userDetails = await prisma.user.findFirst({
            where: {
                username
            }
        })
    
        if(!userDetails){
            res.status(404).json({
                success: false,
                message: "user not found!" 
            })
            return;
        }

        if(userDetails.password != password){
            res.status(403).json({
                success: false,
                message: "wrong password" 
            })
            return;
        }
    
        const payload : jwtContent = {
            userId: userDetails.id,
            username: username
        }

        const token = jwt.sign(payload, "SECRET");
    
        res.json({
            success: true,
            token,
            userId: userDetails.id 
        })

    } catch (error) {
         res.status(402).json({
            success: false,
            message: "something went wrong" 
        })         
    }
})

app.get('/chats/:roomId', async (req, res) => {
    const url = req.url;
    const roomId = url.split('/')[url.split('/').length - 1];

    try {

        const chats = await prisma.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        })
         

        res.status(202).json({
            success: true,
            roomId,
            chats 
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        }) 
    }
})

app.post('/joinRoom', middleware, async (req, res) => {
    const {slug} = req.body;
    const userId = req.userId;
    /* 
        1. room does not exits
        2. user is a member of the room
        3. user is not a member of the room -> add him to the members list
    */

    try {
        if(Number.isNaN(userId)){
            res.status(202).json({
                success: false,
                message: "token expired login again"
            })
        }

        const room = await prisma.room.findFirst({
            where: {
                slug: slug 
            }
        })

        if(room == null){
            res.status(404).json({
                success: false,
                message: `no room with room name ${slug}`
            })
            return;
        }
        
        const user = await prisma.memberOnRoom.findFirst({
            where: {
                roomId: room.id,
                userId: userId 
            }
        })


        if(user == null){
            // 3rd case : user is not a member of the room -> add him to the members list

            const result = await prisma.memberOnRoom.create({
                data: {
                    userId: userId as number,
                    roomId: room.id 
                }
            }) 

            res.status(202).json({
                success: true,
                id: room.id,
                message: `added to the room ${slug}`
            })

            return;
        }

        //2nd case: user is a member of the room

        res.status(202).json({
            success: true,
            id: room.id,
            message: `user with userId ${userId} already in the room with name: ${slug}` 
        })
        return;
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'something went wrong'
        }) 
    }
})

app.get('/room/:slug', async (req, res) => {
    const url = req.url;
    const slug = url.split('/')[url.split('/').length - 1];

    try {
        const room = await prisma.room.findFirst({
            where: {
                slug: slug
            }
        })
        
        if(!room){
            res.status(404).json({
                success: false,
                message: `no room found by the name ${slug}`
            })
            return
        }

        res.status(202).json({
            success: true,
            slug,
            room
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
})

app.get('/user/:userId', async (req, res) => {
    const url = req.url;
    const userId = url.split('/')[url.split('/').length - 1];

    if(Number.isNaN(userId) || userId == undefined){
        res.status(403).json({
            success: false,
            message: "userId is not a number"
        })
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: parseInt(userId as string)
            },
            select: {
                username: true
            }
        })        

        res.status(200).json({
            success: true,
            username: user?.username,
            id: userId
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "something went wrong"
        })
    }
})


//use this to get the whole profile since this is a protect route

app.post('/user', middleware, async (req, res) => {
    const userId = req.userId;
    console.log(userId);
    if(userId == undefined){
        res.json({
            success: false,
            message: "token not found"
        })
        return
    }

    try {
        const result = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                username: true,
                id: true
            }
        })
        console.log(result);

        if(result == null){
            res.status(404).json({
                success: false,
                message: "user not found"
            })
            return;
        }

        res.status(202).json({
            success: true,
            id: result.id,
            username: result.username,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'something went wrong'
        })    
    }
})

app.get('/allRooms', middleware, async(req, res) => {
    const userId = req.userId;
    
    if(userId == undefined){
        res.json({
            success: false,
            message: "token not found"
        })
        return;
    }
    
    try {
        const result = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                rooms: {
                    select: {
                        room: {
                            select: {
                                adminId: true,
                                id: true,
                                slug: true,
                                createdAt: true
                            }
                        }
                    }
                },
                adminOf: {
                    select: {
                        id: true,
                        slug: true,
                        adminId: true,
                        createdAt: true
                    }
                },
                username: true,
                id: true
            }
        }) 


        if(result == null){
            res.status(404).json({
                success: false,
                message: 'no rooms found'
            })
        }


        res.status(202).json({
            success: true,
            rooms: result?.rooms,
            userId: result?.id,
            username: result?.username,
            adminOf: result?.adminOf
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'something went wrong'
        })    
    }
})

app.post('/createRoom', middleware, async (req, res) => {
    const uuid = uuidv4(); 
    // name -> slug
    const {slug} = req.body
    try {
        if(req.userId == undefined){
            res.status(402).json({
                success: false,
                message: "user not found" 
            })
            return;
        }
        const result = await prisma.$transaction(async(tx) => {
            if(req.userId == undefined) return;
            const room = await tx.room.create({
                data: {
                    id: uuid,
                    slug: slug,
                    adminId: req.userId
                }
            })

            const memberOnRoom = await tx.memberOnRoom.create({
                data: {
                   userId: req.userId,
                   roomId: room.id
                }
            })

            return room
        })

        res.json({
            message: "room created",
            success: true,
            roomId: result?.id,
            userId: result?.adminId,
            createdAt: result?.createdAt,
            slug: result?.slug 
        })
    } catch (error) {
        res.status(402).json({
            message: "something went wrong" 
        }) 
    }
})

const PORT = 3021;

app.get('/', (req, res) => {
    res.send("this is Dev's mac!");
})

app.listen(PORT);