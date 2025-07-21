const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../modules/USER');

// Secret should be stored in .env in real applications
const JWT_SECRET = 'Iamagoodboy$';

// Route: POST /api/auth/wallet-login
// Logs in or registers the user using only their wallet address
router.post('/wallet-login', async (req, res) => {
    let success = false;
    const { walletAddress } = req.body;

    // Basic validation
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return res.status(400).json({ success, error: 'Invalid wallet address' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

        // If not, register new user
        if (!user) {
            user = await User.create({
                walletAddress: walletAddress.toLowerCase(),
                name: 'Anonymous' // You can let frontend set this later
            });
        }

        // Generate JWT
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success, error: 'Internal server error' });
    }
});

module.exports = router;
