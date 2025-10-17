const { validationResult } = require('express-validator');
const postService = require('../services/post.service');
const postModel = require('../models/post.model');

module.exports.createPost = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, image } = req.body;
        const userId = req.user._id;

        const result = await postService.createPost(userId, title, content, image)

        return res.status(201).json({ message: 'Post created successfully', result });
    } catch (error) {
        console.error('Error in creating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports.getPostById = async (req, res, next) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const post = await postModel.findById(postId)


        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ message: 'Post fetched successfully', post });

    } catch (error) {
        console.error('Error in get post:', error);
        return res.status(500).json({ message: error.message });
    }
};