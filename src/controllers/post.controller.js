const { validationResult } = require('express-validator');
const postService = require('../services/post.service');
const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const paginationService = require('../helpers/pagination.helper');


module.exports.createPost = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, image } = req.body;
        const userId = req.user._id;

        const isPostExist = await postModel.findOne({ title, deletedAt: null });

        if (isPostExist) {
            return res.status(404).json({ message: "Post already exist with title" });
        }

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

        const post = await postModel.findOne({ _id: postId, deletedAt: null }).select('-likes -comments')


        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ message: 'Post fetched successfully', post });

    } catch (error) {
        console.error('Error in get post:', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.getAllPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;

        const search = req.query.search || '';
        const sort = req.query.sort || '-createdAt';

        const filter = { deletedAt: null };

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        const skip = (page - 1) * pageSize;

        const { records, totalRecords } = await postService.getAllPosts(filter, sort, skip, pageSize);

        const paginationInfo = await paginationService.getPaginationData(page, pageSize, totalRecords)

        return res.status(200).json({ message: "posts fetched successfully", paginationInfo, records })
    } catch (error) {
        console.error('Error in getall posts:', error);
        return res.status(500).json({ message: error.message });
    }
}


module.exports.updatePost = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const postId = req.params.id;
        const userId = req.user._id;
        const { title, content, image } = req.body;


        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const isPostExist = await postModel.findOne({ _id: postId, user: userId, deletedAt: null })
        console.log('isPostExist: ', isPostExist);

        if (!isPostExist) {
            return res.status(404).json({ message: "Post not found" });
        }

        const result = await postService.updatePostById(postId, title, content, image);

        return res.status(200).json({ message: 'Post updated successfully', result });
    } catch (error) {
        console.error('Error at updating posts:', error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        if (!postId) {
            return res.status(400).json({ message: 'Post id required' });
        }

        const post = await postModel.findOne({ _id: postId, user: userId, deletedAt: null })
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const updatedPost = await postModel.findByIdAndUpdate(postId, { deletedAt: new Date() }, { new: true })


        await userModel.updateOne({ _id: userId }, {
            $push: { posts: updatedPost._id },
            $inc: { postsCount: -1 }
        })

        return res.json({ message: 'Post deleted successfully' })

    } catch (error) {
        console.error('Error at updating posts:', error);
        return res.status(500).json({ message: error.message });
    }
}

