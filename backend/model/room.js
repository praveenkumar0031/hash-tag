const mongoose=require('mongoose')

const roomSchema=mongoose.Schema({
    ownerId:{type:ObjectId,required:true},
    memberId:{type:[ObjectId]},
    name:{type:String,required:true,unique:true},
    description:{typr:String},
    isprivate:{type:Boolean,required:true},
    password:{type:String}
},{timestamp:true})

module.exports=mongoose.model("room",roomSchema);