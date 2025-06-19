import express from "express"
const app = express()
import mongoose from "mongoose"




async function main(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        app.listen(3000)
    }catch{
        console.error("error while connecting to db");
        
    }
}

main