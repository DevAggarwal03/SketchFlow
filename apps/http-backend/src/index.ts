import express from 'express'
import jwt from 'jsonwebtoken' 
import { middleware } from './middleware';
import {jwtContent} from "@repo/types"
import prisma from "@repo/db"
import {v4 as uuidv4} from 'uuid'

const app = express();

app.use(express.json());

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
            message: "signed In successfully"
        })
    } catch (error) {
        res.status(402).json({
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
                message: "user not found!" 
            })
            return;
        }

        if(userDetails.password != password){
            res.status(403).json({
                message: "wrong password" 
            })
            return;
        }
    
        const userId = userDetails.id;
        const payload : jwtContent = {
            userId: userDetails.id,
            username: username
        }

        const token = jwt.sign(payload, "SECRET");
    
        res.json({
            token,
            userId: userDetails.id 
        })

    } catch (error) {
         res.status(402).json({
            message: "something went wrong" 
        })         
    }
})

app.post('/createRoom', middleware, async (req, res) => {
    const uuid = uuidv4(); 
    const {name} = req.body
    try {
        if(req.userId == undefined){
            res.status(402).json({
                message: "something went wrong" 
            })
            return;
        }
        const result = await prisma.room.create({
            data: {
                id: uuid,
                slug: name,
                adminId: req.userId
            }
        })
        console.log(result);
        res.json({
            message: "room created",
            roomId: uuid,
            userId: req.userId,
            slug: name
        })
    } catch (error) {
        res.status(402).json({
            message: "something went wrong" 
        }) 
    }
})

const PORT = 8080;

app.listen(PORT);