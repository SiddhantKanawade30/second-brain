import {Schema,model} from "mongoose"



const userSchema = new Schema({
    email : { type : String , required: true , unique:true },
    password :{ type : String , required: true },
    firstName : String,
    lastName : String,
})


const UserModel = model("user",userSchema)

export default UserModel;