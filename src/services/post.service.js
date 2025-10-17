const postModel = require('../models/post.model');
const userModel = require('../models/user.model');


module.exports.createPost = async (userId, title, content, image) => {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        if (!title || !content) {
            throw new Error("Title & content are required")
        }

        const result = await postModel.create({ user: userId, title, content, image: image || "" })

        await userModel.updateOne({ _id: userId }, {
            $push: { posts: result._id },
            $inc: { postsCount: 1 }
        })

        const populatedPost = await result.populate('user', 'username profileImage')
        return populatedPost;

    } catch (error) {
        console.error('post service create post: ', error);
        throw error;
    }
}

module.exports.getAllPosts = async (filter, sort, skip, pageSize) => {
    try {
        const records = await postModel.find(filter).select('-likes -comments').sort(sort).skip(skip).limit(pageSize);

        const totalRecords = await postModel.countDocuments(filter);

        return { records, totalRecords };
    } catch (error) {
        throw error;
    }
}