const user =require('../model/user');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    try {
        const { username, email, password,role } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ username, email, password: hashedPassword ,role});
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        
        res.status(500).json({ message: "Server error" });
    }   
};

exports.loginUser= async (req,res)=>{
    try{
        const {email,password}=req.body;
        const existingUser= await user.findOne({email});
        if(!existingUser){
            return res.status(400).json({ message: "User does not exist" });
        }
        const validpass=await bcrypt.compare(password,existingUser.password);
        if(!validpass){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: existingUser._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.status(200).json({ token, message: "Login successful" });

    }catch(e){
        
        res.status(500).json({ message: "Server error" });
    }
};