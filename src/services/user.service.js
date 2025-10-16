const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const updateUserData = async (userId, userData) => {
    try {
        if (!userId || !userData) {
            throw new Error("User ID & data are required")
        }

        // if (userData.password) {
        //     userData.password = await bcrypt.hash(userData.password, 10);
        // }

        const updatedUser = await userModel.findByIdAndUpdate(userId, userData, { new: true, runValidators: true });

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    } catch (error) {
        console.error('user service updateById: ', error);
        throw error;
    }
}

const getRecords = async (filter, sort, skip, pageSize) => {
    const userRecords = await userModel.find(filter).select('-posts -comments').sort(sort).skip(skip).limit(pageSize).lean();

    const totalRecords = await userModel.countDocuments(filter);

    return { userRecords, totalRecords }
};



const softDeleteUser = async (userId) => {
    try {

        if (!userId) {
            throw new Error("User ID are required")
        }

        const result = await userModel.findByIdAndUpdate(userId, { deletedAt: new Date() }, { new: true });

        return result;
    } catch (error) {
        console.error('user service softDelete: ', error);
        throw error;
    }
}

module.exports = {
    updateUserData,
    getRecords,
    softDeleteUser
};
