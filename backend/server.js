const express=require('express');
const dotenv=require('dotenv');
const connectDb=require('./config/connection');
const app=express();
const authrouter=require('./router/userRouter')
const roomrouter=require('./router/roomRouter');
dotenv.config();
connectDb();
app.use(express.json());
app.use("/api/talks",authrouter);
app.use("/api/room",roomrouter);

app.listen(8000,()=>{console.log("on port 8000 ")});