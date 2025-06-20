import jwt from "jsonwebtoken"
import "dotenv/config"
import { Request, Response, NextFunction } from "express";  
import { model } from "mongoose";


export function userMiddleWare(req : Request, res : Response, next : NextFunction){
    const token = req.headers.token;
    const decodedToken = jwt.verify(token as string , process.env.JWT_USER_SECRET!)

    if(decodedToken){
        res.status(200)
        next()
    }else{
        res.json({
            message : "you do not access to this content"
        })
        return
    }
}

