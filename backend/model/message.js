const mongoose=require('mongoose')


const msgSchema = mongoose.Schema({
    
    roomId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'room',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });
msgSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });


module.exports=mongoose.model("msg",msgSchema);