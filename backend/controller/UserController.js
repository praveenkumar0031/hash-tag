const user =require('../model/user');
exports.getUsersInRange = async (req, res) => {
    try {
        const { lng, lat, distance } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({ message: "Longitude and Latitude are required" });
        }
        const radiusInMeters = (parseFloat(distance) || 10) * 1000;

        const users = await User.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: radiusInMeters
                }
            }
        });

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
        const { lng, lat, formattedAddress } = req.body;
        const userId = req.user.id; // Assuming you have an auth middleware

        if (!lng || !lat) {
            return res.status(400).json({ message: "Coordinates are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    location: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                        formattedAddress: formattedAddress || ""
                    },
                    status: "online" // Good idea to set them online when they update location
                }
            },
            { new: true } // Returns the updated document
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
module.exports = { getUsersInRange };