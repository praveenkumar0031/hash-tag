const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    googleId:{type:String},
    role:{type:String,enum:["admin","user"],required:true},
    avatar:{type:String},
    status:{type:String ,enum:["online","offline"]}
});

module.exports=mongoose.model("user",userSchema);
