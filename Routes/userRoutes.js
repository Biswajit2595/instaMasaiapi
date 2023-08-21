const express=require("express");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { UserModel } = require("../model/userModel");

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const existingUser=await UserModel.findOne({email})
        if(existingUser){
            res.status(200).send({"msg":"User already exist, please login"})
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    res.status(400).send({"error":err})
                }else{
                    const newUser=new UserModel({...req.body,password:hash})
                    await newUser.save();
                    res.status(200).send({"msg":"New user has beeen registered"})
                }
            })
        }
    } catch (error) {
        res.status(500).send({'error':"Internal Server Error"})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(!user){
            res.status(200).send({"msg":"Not a registered user,Please register"})
        }else{
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user._id,user:user.name},"masai",{expiresIn:"7d"})
                    res.status(200).send({"msg":"user successfully logged in",token})
                }else{
                    res.status(400).send({"msg":"Wrong Credentials"})
                }
            })
        }
    } catch (error) {
        res.status(500).send({'error':"Internal Server Error"})
    }
})


module.exports={userRouter}