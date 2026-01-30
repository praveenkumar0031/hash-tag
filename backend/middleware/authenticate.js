const jwt=require('jsonwebtoken');


exports.auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','');
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.id;
        next();
    }catch(error){
        console.error("auth error "+error)
        res.status(401).json({message:"Unauthorized"});
    }
};


