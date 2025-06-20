import mongoose from "mongoose"
import { Schema , model } from "mongoose"

const userSchema = new Schema({
    email : {type: String, unique: true},
    password : {type : String },
    firstName : String,
})

const contentSchema = new Schema({
    title : {type: String, unique: true} ,
    link : {type: String, unique: true},
    tags : {type : mongoose.Types.ObjectId , ref:"Tag"},
    userId : {type : mongoose.Types.ObjectId,ref: "User",required : true}
})

export const userModel = model("User",userSchema)
export const contentModel = model("Content",contentSchema)