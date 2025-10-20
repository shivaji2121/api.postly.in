const { validationResult } = require("express-validator");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");

const createComment = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const { text, postId } = req.body;

        const isPostExist = await postModel.findOne({ _id: postId, deletedAt: null });

        if (!isPostExist) {
            return res.status(404).json({ message: "Post not found" })
        }

        const result = await commentModel.create({ post: postId, user: userId, text });

        return res.status(201).json({ message: "Comment Added succesfully", data: result })
    } catch (error) {
        console.error('Error at creating comment: ', error);
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createComment
};
