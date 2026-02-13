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
            enum: ['Point'],
            
            required: function() { return this.location && this.location.coordinates; }
        },
        coordinates: {
            type: [Number], 
            required: function() { return this.location && this.location.type; }
        }
    }
},{timestamps:true})
roomSchema.index({ location: "2dsphere" });
roomSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });
module.exports=mongoose.model("room",roomSchema);