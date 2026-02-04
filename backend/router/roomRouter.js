const express=require("express");
const router=express.Router();
const {auth}=require('../middleware/authenticate');
const {createRoom,updateRoom,deleteRoom,getRooms,changePrivate,getRoom,joinRoom,leftRoom,getNearbyRoomsByOwner,getRoomsInRange} =require('../controller/RoomController') 

router.post("/create",auth,createRoom);
router.put("/update/:id",auth,updateRoom);
router.delete("/delete/:id",auth,deleteRoom);
router.get("/getall",auth,getRooms);
router.get("/get/:id",auth,getRoom);
router.patch("/status/:id",auth,changePrivate);
router.patch("/join/:id",auth,joinRoom);
router.patch("/leave/:id",auth,leftRoom);
router.get("/nearby",auth,getRoomsInRange);
module.exports=router;
