const mongoose=require('mongoose')

const roomSchema=mongoose.Schema({
    ownerId:{type:Object,required:true},
    memberId:{type:[Object]},
    name:{type:String,required:true,unique:true},
    description:{type:String},
    isprivate:{type:Boolean,required:true},
    password:{type:String},
    location: {
        type: {
            type: String, 
            enum: ['Point'], // 'location.type' must be 'Point'
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
},{timestamps:true})
roomSchema.index({ location: "2dsphere" },{ updatedAt: 1 }, { expireAfterSeconds: 86400 });
module.exports=mongoose.model("room",roomSchema);