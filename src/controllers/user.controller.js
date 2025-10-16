const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const userService = require('../services/user.service');


module.exports.registerUser = async (req, res, next) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { username, email, phone, password, bio } = req.body;

        const isUserExist = await userModel.findOne({ email })

        if (isUserExist) {
            return res.status(409).json({ message: "User already exist" })
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userModel.create({
            username, email, phone, password: hashedPassword, bio
        })

        const token = await user.generateAuthToken();

        return res.status(200).json({ success: true, message: "User created successfully", data: { token, user } })
    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({ message: "Internal server error" })

    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password')

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const passwordCheck = await user.comparePassword(password);

        if (!passwordCheck) {
            return res.status(404).json({ message: "Invalid credentials" })
        }

        const token = await user.generateAuthToken();

        res.cookie('token', token)

        return res.status(200).json({ success: true, message: "User logged in successfully", data: { token, user } })
    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({ message: "Internal server error" })
    }
}


module.exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'User id required' });
        }

        const user = await userModel.findById({ _id: id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: "User fetched successfully", data: user });
    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({ message: "Internal server error" })
    }
}


module.exports.updateUserById = async (req, res, next) => {
    try {
        const id = req.user.id;
        const reqBody = req.body;

        if (!id) {
            return res.status(400).json({ message: 'User id required' });
        }

        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const result = await userService.updateUserData(id, reqBody)

        return res.status(200).json({ success: true, message: "User updated successfully", data: result });

    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({ message: "Internal server error" })
    }
}