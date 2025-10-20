const postModel = require('../models/post.model');
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
    const userRecords = await userModel.find(filter).select('-posts -comments').sort(sort).skip(skip).limit(pageSize);

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

const getAllUserPosts = async (filter, sort, skip, pageSize) => {
    try {
        const userPostRecords = await postModel.find(filter).select('-comments -likes').sort(sort).skip(skip).limit(pageSize).populate('user', 'username email profileImage');
        const totalRecords = await postModel.countDocuments(filter);
        return { userPostRecords, totalRecords };
    } catch (error) {
        console.error('user service getAllUserPosts : ', error);
        throw error;
    }
}


// const getAllUserPostsComments = async (userId, page, pageSize, search, sort) => {
//     try {
//         const skip = (page - 1) * pageSize;

//         // Populate 'posts' and 'comments'
//         const userRecords = await userModel
//             .findOne({ _id: userId, deletedAt: null })
//             .populate({
//                 path: 'posts',
//                 select: 'title content image likesCount commentsCount createdAt',
//                 match: {
//                     deletedAt: null,
//                     ...(search && { title: { $regex: search, $options: 'i' } })
//                 },
//                 options: {
//                     sort: sort,
//                     limit: pageSize,
//                     skip: skip
//                 },
//                 // populate: {
//                 //     path: 'user',
//                 //     select: 'username email profileImage'
//                 // }
//             })
//             .populate({
//                 path: 'comments',
//                 select: 'text post createdAt',
//                 match: { deletedAt: null },
//                 options: {
//                     sort: sort,
//                     limit: pageSize,
//                     skip: skip
//                 },
//                 populate: [
//                     // {
//                     //     path: 'user',
//                     //     select: 'username email profileImage'
//                     // },
//                     {
//                         path: 'post',
//                         select: 'title content'
//                     }
//                 ]
//             });

//         if (!userRecords) {
//             return null;
//         }

//         const totalPosts = userRecords.posts?.length || 0;
//         const totalComments = userRecords.comments?.length || 0;
//         const totalRecords = totalPosts + totalComments;

//         return {
//             userRecords,
//             totalRecords,
//             totalPosts,
//             totalComments
//         };

//     } catch (error) {
//         throw error;
//     }
// };

const getAllUserPostsComments = async (userId, page, pageSize, search, sort) => {
    try {
        const skip = (page - 1) * pageSize;

        // Get user with posts and comments
        const userRecords = await userModel
            .findOne({ _id: userId, deletedAt: null })
            .populate({
                path: 'posts',
                select: 'title content image likesCount commentsCount createdAt',
                match: {
                    deletedAt: null,
                    ...(search && { title: { $regex: search, $options: 'i' } })
                },
                options: {
                    sort: sort
                }
            })
            .populate({
                path: 'comments',
                select: 'text post createdAt',
                match: { deletedAt: null },
                options: {
                    sort: sort
                },
                populate: {
                    path: 'post',
                    select: 'title content'
                }
            });

        if (!userRecords) {
            return null;
        }

        // Map comments to their respective posts
        const postsWithComments = userRecords.posts.map(post => ({
            ...post.toObject(),
            comments: userRecords.comments.filter(
                comment => comment.post._id.toString() === post._id.toString()
            )
        }));

        // Apply pagination
        const paginatedData = postsWithComments.slice(skip, skip + pageSize);
        const totalRecords = postsWithComments.length;

        return {
            data: paginatedData,
            totalRecords
        };

    } catch (error) {
        throw error;
    }
};

module.exports = {
    updateUserData,
    getRecords,
    softDeleteUser,
    getAllUserPosts,
    getAllUserPostsComments
};
