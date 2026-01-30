const express=require("express");
const router=express.Router();
const {registerUser,loginUser,getUserById} =require('../controller/AuthController');
const { auth } = require("../middleware/authenticate");

router.post("/signup",registerUser);
router.post("/login",loginUser);
router.get("/user",auth,getUserById);
module.exports=router;