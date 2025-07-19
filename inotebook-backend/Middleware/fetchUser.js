const jwt = require('jsonwebtoken');

// You can also move this to a separate config file or .env
const JWT_SECRET = 'Iamagoodboy$';

// Middleware function to fetch user from JWT token
const fetchUser = (req, res, next) => {
    // Get the token from the request header
    //Add the header auth-token and its value will be the token you get on logging in via thunderclient 
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        // Verify the token using JWT_SECRET
        // 'data' will store the payload that was used while signing the token
        // Example payload: { user: { id: "some_user_id" }, iat: timestamp }
        const data = jwt.verify(token, JWT_SECRET);

        // 'data.user' contains the user info (e.g., user ID)
        // We attach it to req so that we can access it in the next middleware or route
        req.user = data.user;

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        return res.status(401).send({ error: "Invalid token" });
    }
};

module.exports = fetchUser;
