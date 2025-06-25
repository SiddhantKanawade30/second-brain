import express from "express"
const app = express()
import jwt from "jsonwebtoken"
import { Request,Response } from "express"
import bcrypt from "bcrypt"
import { userModel , contentModel , linkModel } from "./db"
import "dotenv/config"
import mongoose from "mongoose"
import { userMiddleWare } from "./middleware"
import { random } from "./utils"
import cors from "cors" 


mongoose.connect(process.env.MONGO_URL!)

app.use(express.json())
app.use(cors())

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
       const result =  await contentModel.create({
            link,
            title, 
            //@ts-ignore
            userId : req.userId,
            
        })
        res.status(200).json({message : "content created", content : result})
    }catch(err){
            console.error("error is:", err)
            res.status(400).json({message : "content not created"})
    }
})

app.delete("/api/v1/content", userMiddleWare , async function(req:Request,res:Response){
})

app.get("/api/v1/content",userMiddleWare, async(req,res)=>{
        const content = await contentModel.find({
            //@ts-ignore
            userId : req.userId
        })


        res.json({
            content
        })
})

app.post("/api/v1/brain/share",userMiddleWare,async(req,res)=>{
    const { share } = req.body
    

    if(share){
            const exisistingLink = await linkModel.findOne({
            //@ts-ignore
            userId:req.userId
        })

            if(exisistingLink){
             res.json({
                    hash : "/share/"+exisistingLink.hash
                })
                return
        }

            const hashed = random(10)
            await linkModel.create({
                
                //@ts-ignore
                userId : req.userId,
                hash : hashed
            })
        
    }
    else{
        linkModel.deleteOne ({
            //@ts-ignore
            userId: req.userId
        })

        res.json({
            message : "Removed link"
        })
    }

   
})

app.get("/api/v1/brain/:shareLink",async(req,res)=>{
    const hash = req.params.shareLink

    const link = await linkModel.findOne({
        hash
    })

    if(!link){
        res.status(411).json({message : "sorry incorrect input"})
        return 
    }


    const content = await contentModel.find({
        userId : link.userId
    })

    const user = await userModel.findOne({
        _id : link.userId
    })

    res.json({
        username : user?.firstName,
        content : content
    })
})



app.listen(3000)






