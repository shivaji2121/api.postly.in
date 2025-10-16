const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const paginationService = require('../helpers/pagination.helper');


const registerUser = async (req, res, next) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { username, email, phone, password, bio } = req.body;

        const isUserExist = await userModel.findOne({ email, deletedAt: null });

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

const loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email, deletedAt: null }).select('+password')

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
const getUserProfile = async (req, res, next) => {
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


const getUserById = async (req, res, next) => {
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


const updateUserById = async (req, res, next) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.user.id;
        const reqBody = req.body;

        if (!id) {
            return res.status(400).json({ message: 'User id required' });
        }

        const user = await userModel.findOne({ _id: id, deletedAt: null });

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

const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;
        const search = req.query.search || '';
        const sort = req.query.sort || '-createdAt';

        const filter = { deletedAt: null };

        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * pageSize;

        const { userRecords, totalRecords } = await userService.getRecords(filter, sort, skip, pageSize)

        const paginationInfo = await paginationService.getPaginationData(page, pageSize, totalRecords)

        return res.status(200).json({ success: true, message: "User fetched successfully", data: { paginationInfo, userRecords } });
    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'User id required' });
        }

        const user = await userModel.findOne({ _id: id, deletedAt: null });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await userService.softDeleteUser(id);

        return res.status(200).json({ message: "user deleted successfully" })

    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

const updateUserPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'User id required' });
        }

        const user = await userModel.findOne({ _id: id, deletedAt: null }).select('+password');

        if (!user) {
            return res.status(404).json({ status: 404, success: false, message: 'User not found' });
        }

        const isPasswordMatch = await user.comparePassword(oldPassword);

        if (!isPasswordMatch) {
            return res.status(400).json({ status: 400, success: false, message: 'Old password is incorrect' });
        }


        const isSamePassword = await user.comparePassword(newPassword);

        if (isSamePassword) {
            return res.status(400).json({ status: 400, success: false, message: 'New password cannot be the same as old password' });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ status: 200, success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getUserById,
    getAllUsers,
    updateUserById,
    deleteUserById,
    updateUserPassword
};
