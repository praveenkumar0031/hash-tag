const user = require('../model/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); 


const transporter = nodemailer.createTransport({
    service: 'gmail', 
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});


exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await user.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User not found" });

        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        
        existingUser.resetOtp = otp;
        existingUser.resetOtpExpires = Date.now() + 15 * 60 * 1000; 
        await existingUser.save();

        const mailOptions = {
            from: '"Hash-Tag Support" <no-reply@hash-tag.com>',
            to: email,
            subject: 'Your Hash Tag Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It expires in 15 minutes.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">Hash-Tag Password Reset</h2>
                    <p>Use the code below to reset your password. This code is valid for 15 minutes.</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ message: "Error sending email" });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const existingUser = await user.findOne({ 
            email, 
            resetOtp: otp, 
            resetOtpExpires: { $gt: Date.now() } 
        });

        if (!existingUser) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        existingUser.password = hashedPassword;
        existingUser.resetOtp = undefined; 
        existingUser.resetOtpExpires = undefined;
        await existingUser.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getUsersInRange = async (req, res) => {
    try {
        const { lng, lat, distance } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({ message: "Coordinates required" });
        }
        
        
        const radiusInMeters = (parseFloat(distance) || 10) * 1000;

        const users = await user.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: radiusInMeters
                }
            }
        }).select('username avatar status').lean(); 

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.updateLocation = async (req, res) => {
    try {
        const { lng, lat } = req.query;
        const userId = req.userId; 

        if (!lng || !lat) {
            return res.status(400).json({ message: "Coordinates are required" });
        }

        const updatedUser = await user.findByIdAndUpdate(
            userId,
            {
                $set: {
                    location: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    status: "online",
                    lastSeen: new Date() 
                }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Location updated successfully",
            data: updatedUser.location
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};