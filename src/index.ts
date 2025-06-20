import express from "express"
const app = express()
import jwt from "jsonwebtoken"
import { Request,Response } from "express"
import bcrypt from "bcrypt"
import { userModel , contentModel } from "./db"
import "dotenv/config"
import mongoose from "mongoose"
import { userMiddleWare } from "./middleware"


mongoose.connect(process.env.MONGO_URL!)

app.use(express.json())

app.post("/api/v1/signup", async function(req:Request,res:Response){
    const {firstName , email , password} = req.body

    const hashedpass = await bcrypt.hash(password,5)

try{
    const entry = await userModel.create({
        firstName,
        email,
        password : hashedpass
    })
    
    res.status(201).json({
        message : "signed up successfully",
        userId : entry._id
    })
}catch{
        res.status(403).json({
            message : "failed to make entry in db"
        })
}

    
})

const signInHandler = async function(req:Request,res:Response){
    const {email,password} = req.body;

    const response = await userModel.findOne({email})
    
    if(!response){
        res.status(403).json({
            message : "User not found in our database"
        })
        return
    }
//@ts-ignore
    const decodedPass = await bcrypt.compare(password , response.password)

    if(decodedPass){
        const token = jwt.sign({
            id : response._id
        },process.env.JWT_USER_SECRET!)

        res.status(200).json({
            message : "signed in successfully",
            token
        })
    }else{
        res.status(403).json({
            message : "invalid credentials"
        })
    }
}

app.post("/api/v1/signin",signInHandler)

app.post("/api/v1/content", userMiddleWare ,async function(req:Request,res:Response){
    const {title,link} = req.body

    try{
        await contentModel.create({
            link,
            title, 
            //@ts-ignore
            userId : req.userId,
            tags : []
        })
        res.status(200).json({message : "content created"})
    }catch{
            res.status(400).json({message : "content not created"})
    }
})




app.listen(3000)






