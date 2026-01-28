const jwt=require('jsonwebtoken');


exports.auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','');
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.id;
        next();
    }catch(error){
        res.status(401).json({message:"Unauthorized"});
    }
};
exports.msglayer=async(req,res,next)=>{
    try{
        const userId=req.userId;
        
        req.roomId=
        req.msgId=
        next();
    }catch(error){
        res.status(401).json({message:"Unauthorized"});
    }
};


