const jwt=require("jsonwebtoken");
const { ListModel } = require("../model/blacklistmodel");

const auth=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    try {
        const blacklisted=await ListModel.findOne({token})
        if(blacklisted){
            res.status(400).send({"msg":"Please Login Again"})
        }else{
            const decoded=jwt.verify(token,"masai")
            if(decoded){
                req.body.userID=decoded.userID
                req.body.user=decoded.user
                next()
            }else{
                res.status(400).send({"error":"Please Login Again"})
            }
        }
    } catch (error) {
        res.status(500).send({'error':"Internal Server Error"})
    }
}

module.exports={auth}