const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports.updateUserData = async (userId, userData) => {
    try {
        if (!userId || !userData) {
            throw new Error("User ID & data are required")
        }

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

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

module.exports.getRecords = async (filter, sort, skip, pageSize) => {
    const userRecords = await userModel.find(filter).sort(sort).skip(skip).limit(pageSize).lean();

    const totalRecords = await userModel.countDocuments(filter);

    return { userRecords, totalRecords }
};

