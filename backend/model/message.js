const mongoose=require('mongoose')


const msgSchema = mongoose.Schema({
    // Change from Object to ObjectId and add 'ref'
    roomId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'room', // This must match your room model name
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', // This must match your user model name
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });


module.exports=mongoose.model("msg",msgSchema);