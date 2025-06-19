import express from "express";
const app = express();
import z from "zod";
import bcrypt from "bcrypt";
import UserModel from "../db";
import jwt from "jsonwebtoken"
import 'dotenv/config'
const UserRouter = express.Router()
let throwErr = false;

UserRouter.post("/api/v1/signup", async function (req, res) {
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
  } catch {
    res.json({
      throwErr: true,
      message: "There was some problem during Signing In",
    });
  }

  if (!throwErr) {
    res.json({
      message: "you are signed in",
    });
  }
});

UserRouter.post("/api/v1/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  try{
    const response = await UserModel.findOne({
    email: email,
  });

  if (!response) {
    res.json({
      message: "User does not exist in our database",
    });
  }

  const matchedPass = await bcrypt.compare(password, response.password);

  if(!matchedPass){
    res.json({
        message : "invalid password"
    })
  }

  const secret = process.env.JWT_USER_SECRET;

  if(!secret){
    res.json({
        message : "environment variable not defined"
    })
  }

    const token = jwt.sign(
        {id : response?._id.toString()},
        secret
    )
  
  }catch{
        return res.status(500).json({ message: "Something went wrong" });
  }
 
  
  

  
});
UserRouter.get("/api/v1/content", async function (req, res) {});
UserRouter.delete("/api/v1/content", async function (req, res) {});
UserRouter.post("/api/v1/brain/share", async function (req, res) {});

UserRouter.get("/api/v1/brain/:shareLink", async function (req, res) {});


module.exports ={
    UserRouter : UserRouter
}