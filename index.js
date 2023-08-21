const express=require("express")
const cors=require("cors")
const { connection } = require("./db")
const { postRouter } = require("./Routes/postRoutes")
const { userRouter } = require("./Routes/userRoutes")
const { ListModel } = require("./model/blacklistmodel")
const app=express()
app.use(cors())
app.use(express.json())
app.use("/posts",postRouter)
app.use("/users",userRouter)


app.get("/",(req,res)=>{
    res.send("this is the home page")
})

app.get("/logout",async(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1]
    try {
        const list=new ListModel({token})
        await list.save()
        res.status(200).send({"msg":"user has been successfully logged out"})
    } catch (error) {
        res.status(500).send({"error":"Internal Server Error"})
    }
})

app.listen(4000,async(req,res)=>{
    try {
        await connection
        console.log('Connected to DB')
        console.log('server is running')
    } catch (error) {
        res.status(500).send({"error":"Internal Server Error"})
    }
})