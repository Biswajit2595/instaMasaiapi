const express=require("express")
const { auth } = require("../middleware/auth")
const { PostModel } = require("../model/postModel")
const postRouter=express.Router()

postRouter.post("/add",auth,async(req,res)=>{
    try {
        const newPost=new PostModel(req.body)
        await newPost.save()
        res.status(200).send({"msg":"new post has been added",post:req.body})
    } catch (error) {
        res.status(500).send({'error':"Internal Server Error"})
    }
})

postRouter.get("/",auth,async(req,res)=>{
    const {device,min,max}=req.query;
    const page=req.query.page || 1;
    const limit=req.query.limit || 3;
    const toSkip=limit*(page-1)
    const query={
        userID:req.body.userID
    }
    if(device){
        query.device=device;
    }
    if(min && max){
        query.$and=[
            {no_of_comments:{$lt:max}},
            {no_of_comments:{$gt:min}}
        ]
    }

    try {
        const posts=await PostModel.find(query).skip(toSkip).limit(limit)
        res.status(200).send(posts)
    } catch (error) {
        res.status(500).send({'error':"Internal Server Error"})
    }
})

postRouter.get("/top",auth,async(req,res)=>{
    const {device,device1,device2}=req.query;
    const devide=req.query.device || ""
    const page=req.query.page || 1;
    const limit=req.query.limit || 3;
    const toSkip=limit*(page-1)
    const query={
        userID:req.body.userID
    }
    if(device){
        query.device=device
    }
    if(device2 && device1){
        query.$and=[
            {device:device1},
            {device2:device2}
        ]
    }
    try {
        const userID=req.body.userID;
        const posts=await PostModel.find({userID}).sort({no_of_comments:-1}).skip(toSkip).limit(limit)
        res.status(200).send(posts)
    } catch (error) {
        res.status(500).send({'error':"Internal Server Error"})
    }
})

postRouter.patch("/update/:id",auth,async(req,res)=>{
    const {id}=req.params;
    const post=await PostModel.findOne({_id:id})
    try {
        if(req.body.userID!==post.userID){
            res.status(400).send({"msg":"You are not authorized to update this post"})
        }else{
            const update=await PostModel.findByIdAndUpdate({_id:id},req.body)
            res.status(200).send({"msg":`Post with _id:${id} has been updated`})
        }
    } catch (error) {
        res.status(500).send({'error':"Internal Server Error"})
    }
})

postRouter.delete("/delete/:id",auth,async(req,res)=>{
    const {id}=req.params;
    const post=await PostModel.findOne({_id:id})
    try {
        if(req.body.userID!==post.userID){
            res.status(400).send({"msg":"You are not authorized to update this post"})
        }else{
            const update=await PostModel.findByIdAndDelete({_id:id},req.body)
            res.status(200).send({"msg":`Post with _id:${id} has been Deleted`})
        }
    } catch (error) {
        res.status(500).send({'error':"Internal Server Error"})
    }
})

module.exports={postRouter}