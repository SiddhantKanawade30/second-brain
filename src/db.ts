import {Schema,model} from "mongoose"
import { string } from "zod";



const userSchema = new Schema({
    email : { type : String , required: true , unique:true },
    password :{ type : String , required: true },
    firstName : String,
    lastName : String,
})

const contentSchema = new Schema ({
    title : {type :String , required : true} ,
    content : {type :String , required : true},
    link : {type :String , required : true}
})

export const contentModel = model("content",contentSchema)
export const UserModel = model("user",userSchema)