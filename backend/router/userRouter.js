const express=require("express");
const router=express.Router();
const {registerUser,loginUser,getUserById} =require('../controller/AuthController');
const { auth } = require("../middleware/authenticate");
const {getUsersInRange,updateLocation} =require('../controller/UserController');
const {oAuth} =require('../controller/AuthController');
router.post("/signup",registerUser);
router.post("/login",loginUser);
router.get("/user",auth,getUserById);
router.get("/users/nearby",auth,getUsersInRange);//users/nearby?lng=77.5944&lat=12.9716&distance=5
router.patch("/user/location",auth,updateLocation);//users/nearby?lng=77.5944&lat=12.9716&distance=5
router.post("/auth/google", oAuth);
module.exports=router;