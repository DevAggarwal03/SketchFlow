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
        console.log(username, password);
        await prisma.user.create({
            data:{
                username,
                password
            }
        })
        res.status(200).json({
            success: true,
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
    console.log('hit the backedn');
    const url = req.url;
    const roomId = url.split('/')[url.split('/').length - 1];
    console.log(roomId);

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

app.get('/room/:slug', async (req, res) => {
    const url = req.url;
    const slug = url.split('/')[url.split('/').length - 1];
    console.log(slug);

    try {
        const room = await prisma.room.findFirst({
            where: {
                slug: slug
            }
        }) 

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
        const result = await prisma.room.create({
            data: {
                id: uuid,
                slug,
                adminId: req.userId
            }
        })
        console.log(result);
        res.json({
            message: "room created",
            success: true,
            roomId: result.id,
            userId: result.adminId,
            createdAt: result.createdAt,
            slug: result.slug 
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