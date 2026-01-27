const mongoose=require('mongoose')

const msgSchema=mongoose.Schema({
    roomId:{type:Object,required:true},
    SenderId:{type:Object,required:true},
    content:{type:String,required:true},
},{timestamps:true})

module.exports=mongoose.model("msg",msgSchema);