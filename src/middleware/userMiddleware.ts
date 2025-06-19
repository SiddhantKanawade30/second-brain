import jwt from "jsonwebtoken"
import "dotenv/config"
import { Request, Response, NextFunction } from "express";  
import { model } from "mongoose";


function userMiddleWare(req : Request, res : Response, next : NextFunction){
    const token = req.headers.token;
    const decodedToken = jwt.verify(token as string , process.env.JWT_SECRET!)

    if(!decodedToken){
        res.status(401).json({
            message : "You are not authorised to access this resource"
        })
    }
}

module.exports = userMiddleWare;