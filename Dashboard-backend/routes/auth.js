const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../modules/USER');

// Secret should be stored in .env
const JWT_SECRET = 'Iamagoodboy$';

// Route: POST /api/auth/wallet-login
router.post('/wallet-login', async (req, res) => {
    let success = false;
    const {
        walletAddress,
        name,
        profilePicture,
        bannerImage,
        bio,
        role,
        location,
        website
    } = req.body;

    // Basic validation
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return res.status(400).json({ success, error: 'Invalid wallet address' });
    }

    try {
        let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

        if (!user) {
            // Register new user with profile info
            user = await User.create({
                walletAddress: walletAddress.toLowerCase(),
                name: name || "Anonymous",
                profilePicture: profilePicture || "",
                bannerImage: bannerImage || "",
                bio: bio || "",
                role: role || "student",
                location: location || "",
                website: website || ""
            });
        } else {
            // Update profile if info is provided
            if (name || profilePicture || bannerImage || bio || role || location || website) {
                user.name = name || user.name;
                user.profilePicture = profilePicture || user.profilePicture;
                user.bannerImage = bannerImage || user.bannerImage;
                user.bio = bio || user.bio;
                user.role = role || user.role;
                user.location = location || user.location;
                user.website = website || user.website;
                await user.save();
            }
        }

        // JWT creation
        const data = { user: { id: user._id } };
        const authToken = jwt.sign(data, JWT_SECRET);

        // Always include all expected fields for frontend
        const userResponse = {
            ...user._doc,
            address: user.walletAddress // For frontend compatibility
        };

        success = true;
        res.json({ success, authToken, user: userResponse });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: 'Internal server error' });
    }
});

module.exports = router;