const express=require("express");
const router=express.Router();
const {registerUser,loginUser} =require('../controller/AuthController');

router.post("/sigin",registerUser);
router.post("/login",loginUser);
module.exports=router;