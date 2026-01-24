const mongoose=require('mongoose')

const msgSchema=mongoose.Schema({
    roomId:{type:ObjectId,required:true},
    SenderId:{type:ObjectId,required:true},
    content:{type:String,required:true},
},{timestamp:true})

module.exports=mongoose.model("msg",msgSchema);