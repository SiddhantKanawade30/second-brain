import express from "express";
import { Request , Response , Router } from "express";
import z from "zod";
import bcrypt from "bcrypt";
import {UserModel} from "../db";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken"
import 'dotenv/config'
const UserRouter : Router = express.Router()

UserRouter.post("/api/v1/signup", async function (req: Request, res: Response) {
  const requiredBody = z.object({
    email: z.string(),
    password: z.string().min(5).max(50),
    firstName: z.string().min(2).max(12),
    lastName: z.string().min(2).max(12),
  });

  const safeParsed = requiredBody.safeParse(req.body);

  if (!safeParsed.success) {
    res.json({
      error: safeParsed.error.errors,
    });
    return;
  }

  const { email, password, firstName, lastName } = safeParsed.data;

  const hashedPass = await bcrypt.hash(password, 5);

  try {
    await UserModel.create({
      email: email,
      password: hashedPass,
      firstName: firstName,
      lastName: lastName,
    });

    res.json({
      message: "You are successfully signed up",
    });

  } catch {
    res.json({
      message: "There was some problem during Signing In",
    });
  }
});

const SignInHandler : RequestHandler = async function(req, res){
const { email , password } = req.body

try{

    const user = await UserModel.findOne({email})

    if(!user){
      res.status(404).json({
        message : "User not found in our data base"
      })
    return 
  }

  const correctPass = await bcrypt.compare(password, user.password)

  if(!correctPass){
    res.status(401).json({
      message : "Password is incorrect"
    })
     return
  }

  const token = jwt.sign({ id : user._id }, process.env.JWT_USER_SECRET!)

 res.status(200).json({
    token,
    message : "You are successfully signed in"
  });

}catch{
  res.status(500).json({
    message: "There was some problem during Signing In",
  })
}
}


UserRouter.post(("/api/v1/signin"), SignInHandler);

UserRouter.get("/api/v1/content", async function (req, res) {

});
UserRouter.delete("/api/v1/content", async function (req, res) {});
UserRouter.post("/api/v1/brain/share", async function (req, res) {});

UserRouter.get("/api/v1/brain/:shareLink", async function (req, res) {

});

export { UserRouter }