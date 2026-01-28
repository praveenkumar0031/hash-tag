//const user=require('../model/user')
const msg=require('../model/message');


exports.addmessage=async(req,res)=>{
    try{
        const roomId=req.roomId;
        const senderId=req.userId;
        const {content}=req.body;
        
        const sendermsg=new msg({roomId,senderId,content});
        await sendermsg.save();
        const io = req.app.get("socketio");
        io.to(roomId).emit("new-message", sendermsg);
        res.status(201).json(sendermsg);
    }catch(e){
        console.log("add message error:",e);
        res.status(500).json("server error");
    }
}

exports.removemessage=async(req,res)=>{
    try{
        const _id=req.msgId;
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
        const roomId=req.roomId;
        const resmsg=await msg.find({roomId}).sort({createdAt:1}).limit(50);
        if(!resmsg){
            return res.status(200).json("no message found" );
        }
        res.status(200).json(resmsg);
    }catch(e){
        console.log("get messages error:",e);
        res.status(500).json("server error");
    }
}

exports.modifymessages=async(req,res)=>{
    try{
        const _id=req.msgId;
        const content=req.body.content;
        const updated=await msg.findOneAndUpdate(
            {_id},
            {content},
            {new:true}
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