const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports.isAuthorized = async (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization?.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Token not provided' });
        }

        const userData = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ _id: userData._id, deletedAt: null })

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }

        req.user = user;

        return next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
}


