const express=require("express");
const router=express.Router();
const {auth}=require('../middleware/authenticate');
const {addmessage,removemessage,getmessages,modifymessage} =require('../controller/MsgController')

router.post('/add/:id',auth,addmessage)
router.delete('/delete/:id',auth,removemessage)
router.get('/chat/:id',auth,getmessages)
router.patch('/edit/:id',auth,modifymessage)

module.exports=router;