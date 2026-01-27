const mongoose=require('mongoose')

const roomSchema=mongoose.Schema({
    ownerId:{type:Object,required:true},
    memberId:{type:[Object]},
    name:{type:String,required:true,unique:true},
    description:{type:String},
    isprivate:{type:Boolean,required:true},
    password:{type:String}
},{timestamps:true})
    
module.exports=mongoose.model("room",roomSchema);