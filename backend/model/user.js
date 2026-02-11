const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required: false},
    googleId:{type:String},
    role:{type:String,enum:["admin","user"],required:true,default:"user"},
    avatar:{type:String},
    status:{type:String ,enum:["online","offline"]},
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number], 
            index: '2dsphere' // Essential for proximity searches
        },
        formattedAddress: String
    }
});
userSchema.index({ location: "2dsphere" });
module.exports=mongoose.model("user",userSchema);
