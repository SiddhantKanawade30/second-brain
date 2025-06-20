import { Request, NextFunction ,Response  } from "express";
import "dotenv/config"
import jwt from 'jsonwebtoken'


export const userMiddleWare = async(req:Request , res:Response , next:NextFunction) =>{

const token = req.headers.token;
const decodedToken = await jwt.verify(token as string, process.env.JWT_USER_SECRET!)

if(decodedToken){
    //@ts-ignore
    req.userId = decodedToken.id
    next()
}else{
    res.status(404).json({
        message : "access rejected"
    })
}

}