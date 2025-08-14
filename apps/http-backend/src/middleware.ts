import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import { jwtContent } from '@repo/types';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, 'SECRET');

    if(decoded){
        if(typeof decoded == "string"){
            return;
        }
        req.userId = decoded.userId;
        next();
    }else{
        res.status(403).json({
            message: "unauthorized request"
        })
    }

}