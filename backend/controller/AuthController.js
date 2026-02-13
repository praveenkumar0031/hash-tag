const user = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const dotenv=require('dotenv');
dotenv.config();
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.FRONTEND_URL
);

const oAuth = async (req, res) => {
    const { code } = req.body;

    
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;

    if (!client_id || !client_secret) {
        console.error("CRITICAL: Google Credentials missing from .env");
        return res.status(500).json({ message: "Server configuration error" });
    }

    
    const oauth2Client = new OAuth2Client(client_id, client_secret, `${process.env.FRONTEND_URL}/login`);

    try {
        
        
        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens || !tokens.id_token) {
            
            return res.status(400).json({ message: "Google did not return an id_token. The code might be expired or used." });
        }

        
        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: client_id,
        });

        const { email, name, sub, picture } = ticket.getPayload();

        
        const oAuthuser = await user.findOneAndUpdate(
            { email },
            {
$set: {
            email,
            name,
            username: name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
            googleId: sub,
            avatar: picture,
            role: "user"
        },
        $unset: { location: "" }
            },
            { new: true, upsert: true, runValidators: true }
        );

        const appToken = jwt.sign({ id: oAuthuser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        
        res.json({ token: appToken, user: oAuthuser });

    } catch (error) {
        console.error("GOOGLE AUTH ERROR:", error.message);
        res.status(401).json({ message: "Authentication failed", error: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await user.findOne({ email });
        const existingUsername = await user.findOne({ username });

        if (existingUser) return res.status(400).json({ message: "email already exists" });
        if (existingUsername) return res.status(400).json({ message: "User name already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ username, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user.findOne({ email });

        if (!existingUser) return res.status(400).json({ message: "User doesn't exist" });

        const validpass = await bcrypt.compare(password, existingUser.password);
        if (!validpass) return res.status(400).json({ message: "Wrong Password" });

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (e) {
        console.error("login error:", e);
        res.status(500).json({ message: "Server error" });
    }
};

const getUserById = async (req, res) => {
  try {
      const userId = req.userId;
      const existingUser = await user.findOne({ _id: userId });
      if (!existingUser) return res.status(400).json({ message: "User doesn't exist" });
      res.status(200).json(existingUser);
  } catch (e) {
      console.error("get userById error:", e);
      res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
    oAuth,
    registerUser,
    loginUser,
    getUserById
};