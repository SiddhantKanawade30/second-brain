import mongoose from "mongoose"
import { Schema , model } from "mongoose"

const userSchema = new Schema({
    email : {type: String, unique: true},
    password : {type : String },
    firstName : String,
})

const contentSchema = new Schema({
    title : {type: String, required : true } ,
    link : {type: String, required: true},
    type : String,
    tags : {type : mongoose.Types.ObjectId , ref:"Tag"},
    userId : {type : mongoose.Types.ObjectId,ref: "User",required : true}
})

const linkSchema = new Schema({
    hash : String ,
    userId : {type:mongoose.Types.ObjectId , ref:"User" , required:true , unique:true}
})


export const linkModel = model("Link",linkSchema)
export const userModel = model("User",userSchema)
export const contentModel = model("Content",contentSchema)