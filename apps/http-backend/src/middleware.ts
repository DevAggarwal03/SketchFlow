import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1] ?? "noToken";
    console.log(token);

    const decoded = jwt.verify(token, 'SECRET');

    if(decoded){
        if(typeof decoded == "string"){
            return;
        }
        req.userId = decoded.userId;
        console.log(req.userId);
        next();
    }else{
        res.status(403).json({
            message: "unauthorized request"
        })
    }

}