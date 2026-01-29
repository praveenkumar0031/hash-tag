//const user=require('../model/user')
const msg=require('../model/message');


exports.addmessage=async(req,res)=>{
    try{
        const roomId=req.params.id;
        const senderId=req.userId;
        const {content}=req.body;
        
        const sendermsg=new msg({roomId,senderId,content});
        await sendermsg.save();
        const populatedMsg = await sendermsg.populate('senderId', 'username');
        const io = req.app.get("socketio");
        io.to(roomId.toString()).emit("new-message", populatedMsg);
        res.status(201).json(populatedMsg);
    }catch(e){
        console.log("add message error:",e);
        res.status(500).json("server error");
    }
}

exports.removemessage=async(req,res)=>{
    try{
        const _id=req.params.id;;
        const result=await msg.deleteOne({_id});
        if(result.deletedCount===0){
            return res.status(404).json("msg not found it" );
        }
        const io = req.app.get("socketio");
        io.emit("message-deleted", _id);

        res.status(200).json("message deleted !");
        
    }catch(e){
        console.log("add message error:",e);
        res.status(500).json("server error");
    }
}

exports.getmessages=async(req,res)=>{
    try{
        const roomId=req.params.id;
        const resmsg=await msg.find({roomId}).populate('senderId','username').sort({createdAt:1});
        if(!resmsg){
            return res.status(200).json("no message found" );
        }
        res.status(200).json(resmsg);
    }catch(e){
        console.log("get messages error:",e);
        res.status(500).json("server error");
    }
}

exports.modifymessage=async(req,res)=>{
    try{
        const _id=req.params.id;
        const content=req.body.content;
        const updated=await msg.findOneAndUpdate(
            {_id},
            {content}
        );
        if(!updated){
            return res.status(404).json("message  not found" );
        }
        const io = req.app.get("socketio");
        io.emit("message-updated", updated);
        res.status(200).json(resmsg);
    }catch(e){
        console.log("update message error:",e);
        res.status(500).json("server error");
    }
}