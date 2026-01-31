
const msg = require('../model/message')
const room = require('../model/room')
const bcrypt = require('bcrypt')

exports.createRoom = async (req, res) => {
    try {

        const { name, description, isprivate } = req.body;
        const ownerId = req.userId;
        const memberId = [ownerId];

        const existingroom = await room.findOne({ name });
        if (existingroom) {
            return res.status(400).json("room name already exists");
        }
        var password = null;
        const user_pass = req.body.password;
        if (isprivate) {
            if (user_pass)
                password = await bcrypt.hash(user_pass, 10);
            else
                return res.status(404).json("Missing password ");
        }
        const newroom = new room({ ownerId, name, memberId, description, isprivate, password });
        await newroom.save();
        const io = req.app.get('socketio');
        io.emit('room-list-update', newroom);
        res.status(201).json(newroom);
    } catch (e) {
        console.log("room create error:", e);
        res.status(500).json("server error");
    }
}
exports.updateRoom = async (req, res) => {
    try {
        const ownerId = req.userId;
        const roomId = req.params.id;
        const { name, description, isprivate, password: user_pass } = req.body;

        // 1. Prepare update object
        const updateData = {
            name,
            description,
            isprivate
        };

        // 2. Only hash and update password if a new one is provided
        if (isprivate === true && user_pass) {
            updateData.password = await bcrypt.hash(user_pass, 10);
        }

        // 3. Find and Update
        // { new: true } returns the modified document rather than the original
        const updatedRoom = await room.findOneAndUpdate(
            { _id: roomId, ownerId: ownerId }, 
            { $set: updateData },
            { new: true } 
        );

        if (!updatedRoom) {
            return res.status(404).json("Room not found or you are not the owner");
        }

        // 4. Socket Emit for Real-time Dashboard Updates
        const io = req.app.get('socketio');
        if (io) {
            io.emit("room-updated", updatedRoom);
        }

        res.status(200).json(updatedRoom);
    } catch (e) {
        console.error("Room update error:", e);
        res.status(500).json("Server error");
    }
};
exports.getRooms = async (req, res) => {
    try {
        const existingroom = await room.find().sort({ createdAt: -1 });//resently created first
        if (!existingroom) {
            return res.status(400).json("No room exists");
        }
        res.status(201).json(existingroom);
    } catch (e) {
        console.log("get rooms error:", e);
        res.status(500).json("server error");
    }
}
exports.getRoom = async (req, res) => {
    try {

        const existingroom = await room.findOne({ _id: req.params.id });
        if (!existingroom) {
            return res.status(400).json("No room exists");
        }
        res.status(201).json(existingroom);
    } catch (e) {
        console.log("get room error:", e);
        res.status(500).json("server error");
    }
}
exports.deleteRoom = async (req, res) => {
    try {
        const ownerId = req.userId;
        const _id = req.params.id;
        const result = await room.deleteOne({ _id: _id, ownerId: ownerId })
        const resetmsg = await msg.deleteMany({ roomId: _id })
        if (result.deletedCount === 0) {
            return res.status(404).json("Room not found or you don't have permission to delete it");
        }
        const io = req.app.get('socketio');
        io.emit("room-deleted", _id);

        res.status(200).json("Room Deleted sucessfully");
    } catch (error) {
        console.log("Delete room Error:", error);
        res.status(500).json({ message: " Server error" });
    }
}
exports.changePrivate = async (req, res) => {
    try {
        const ownerId = req.userId;
        const { isprivate, password } = req.body;
        user_pass = await bcrypt.hash(password, 10) || null;
        if (isprivate && !password) {
            return res.status(406).json("password required!");
        }
        const existingroom = await room.findOneAndUpdate({
            _id: req.params.id,
            ownerId: ownerId
        }, {
            isprivate: isprivate,
            password: user_pass
        });
        if (!existingroom) {
            return res.status(500).json({ existingroom }, "room not exists!");
        }
        res.status(200).json("room status Updated sucessfully!");
    } catch (e) {
        console.log("room status error:", e);
        res.status(400).json("server error");
    }
}
exports.joinRoom = async (req, res) => {
    try {
        const userId = req.userId;
        const roomId = req.params.id;
        const {password}=req.body;
        
        var existingroom = await room.findById({ _id: roomId });
        
        if (!existingroom) {
            return res.status(404).json("room not found");
        }
        

        const isOwner = existingroom.ownerId.toString() === userId.toString();

        
        if (!isOwner && existingroom.isprivate) {
            
            if (!existingroom.password) {
                return res.status(500).json("Room has no password set");
            }
            if (!password) {
                return res.status(400).json("room password required");
            }


            const validpass = await bcrypt.compare(password, existingroom.password);
            if (!validpass) {
                return res.status(400).json("Invalid room password");
            }
        }

        
        if (existingroom.memberId.includes(userId)) {
            
            return res.status(200).json({ "room": existingroom, message: "User already in room" });
        }

        
        existingroom.memberId.push(userId);
        await existingroom.save()
        const io = req.app.get('socketio');
        io.to(roomId).emit("user-joined-room", {
            roomId,
            userId
        });

        res.status(200).json({ "room": existingroom });

    } catch (e) {
        console.log("Join Room Error:", e);
        res.status(500).json("server error");
    }
}

exports.leftRoom = async (req, res) => {
    try {
        const userId = req.userId;
        const roomId = req.params.id;
        const existingroom = await room.findById({ _id: roomId });
        if (!existingroom) {
            return res.status(404).json("No room exists");
        }
        if (!existingroom.memberId.includes(userId)) {
            return res.status(400).json({ message: "User already left from room" });
        }
        existingroom.memberId = existingroom.memberId.filter(
            id => id.toString() !== userId.toString()
        );

        await existingroom.save()
        const io = req.app.get('socketio');
        io.to(roomId).emit("user-left-room", {
            roomId,
            userId
        });

        res.status(200).json("User left from room");

    } catch (e) {
        console.log("Left Room Error:", e);
        res.status(500).json("server error");
    }
}
exports.getNearbyRoomsByOwner = async (req, res) => {
    try {
        const { lng, lat, distance } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({ message: "Coordinates are required" });
        }

        const radiusInMeters = (parseFloat(distance) || 10) * 1000;

        const results = await User.aggregate([
            {
                // Step 1: Find Owners near the center point
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    distanceField: "distanceToUser",
                    maxDistance: radiusInMeters,
                    spherical: true
                }
            },
            {
                // Step 2: Join with the Rooms collection
                $lookup: {
                    from: "rooms",           // The name of your Rooms collection in MongoDB
                    localField: "_id",       // Owner's ID in User collection
                    foreignField: "ownerId", // Field in Room collection referencing User
                    as: "ownerRooms"
                }
            },
            {
                // Step 3: Remove users who don't have any rooms
                $match: {
                    "ownerRooms.0": { $exists: true }
                }
            },
            {
                // Step 4: Format output to see individual rooms
                $unwind: "$ownerRooms"
            },
            {
                // Step 5: Clean up the final object structure
                $project: {
                    _id: "$ownerRooms._id",
                    roomName: "$ownerRooms.name",
                    distance: "$distanceToUser",
                    owner: {
                        username: "$username",
                        avatar: "$avatar"
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};