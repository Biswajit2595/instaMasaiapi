const mongoose=require("mongoose")

const listSchema=mongoose.Schema({
    token:{type:String,required:true},
},{versionKey:false})

const ListModel=mongoose.model("list",listSchema)

module.exports={ListModel}