const user=require('../model/user')
const msg=require('../model/message')
const room=require('../model/room')
const bcrypt=require('bcrypt')

exports.createRoom=async(req,res)=>{
    try{
        const {ownerId,name,description,isprivate}=req.body;
        const existingroom= await room.findOne({name});
        if(existingroom){
            return  res.status(400).json("room name already exists");
        }
        var password=null;
        if(isprivate){
            password=await bcrypt.hash(req.body.password,10);
        }
        const newroom=new room({ownerId,name,description,isprivate,password});
        await newroom.save();
        res.status(201).json({newroom},"room created sucessfully!");
    }catch(e){
        console.log(e);
        res.status(400).json("server error");
    }
}

exports.updateRoom=async(req,res)=>{
    try{
        //const {ownerId,name,description,isprivate}=req.body;
        const existingroom= await room.findOneAndUpdate({
            owner:req.ownerId,
            _id:req.params.id
        },{
            name:req.body.name,
            description:req.body.description,
            isprivate:req.body.iprivate,
            password:req.body.password
        });
        if(!existingroom){
            res.status(500).json({existingroom},"room not exists!");
        }
        res.status(201).json({existingroom},"room created sucessfully!");
    }catch(e){
        console.log(e);
        res.status(400).json("server error");
    }
}
exports.getRooms=async(req,res)=>{
    try{
        
        const existingroom= await room.find();
        if(!existingroom){
            return  res.status(400).json("No room exists");
        }
        res.status(201).json({"room":existingroom});
    }catch(e){
        console.log(e);
        res.status(400).json("server error");
    }
}
exports.deleteRoom=async(req,res)=>{
    try{
        const existingroom=await task.deleteOne({
            owner:req.ownerId,
            _id:req.params.id
        })
        if(!existingroom){
            res.json({message:"room not exists"});
        }
        res.json({message:"Deleted sucessfully"});
    }catch(error){
        res.status(500).json({message:" Server error"});
    }
}