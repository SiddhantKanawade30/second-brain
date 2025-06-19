import mongoose from "mongoose"



const userSchema = new mongoose.Schema({
    email : { type : String , required: true , unique:true },
    password :{ type : String , required: true },
    firstName : String,
    lastName : String,
})


const UserModel = mongoose.model("user",userSchema)

export default UserModel;