const { validationResult } = require("express-validator");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const paginationService = require("../helpers/pagination.helper");

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

const getCommentById = async (req, res, next) => {
    try {
        const commentId = req.params.id;

        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        const comment = await commentModel.findOne({ _id: commentId, deletedAt: null });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        return res.status(200).json({ message: "Comment fetched successfully", data: comment });
    } catch (error) {
        console.error('Error at fetching comment by ID: ', error);
        return res.status(500).json({ message: error.message });
    }
}

const updateCommentById = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const commentId = req.params.id;
        const { text } = req.body;

        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        const comment = await commentModel.findOne({ _id: commentId, deletedAt: null });

        if (!comment) {
            return res.status(400).json({ message: "Comment not found" });
        }

        const result = await commentModel.findByIdAndUpdate(commentId, { text }, { new: true });

        return res.status(200).json({ message: "Comment updated successfully", data: result });

    } catch (error) {
        console.error('Error at updating comment by ID: ', error);
        return res.status(500).json({ message: error.message });
    }
}

const softDeleteCommentById = async (req, res, next) => {
    try {
        const commentId = req.params.id;

        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        const comment = await commentModel.findOne({ _id: commentId, deletedAt: null });

        if (!comment) {
            return res.status(400).json({ message: "Comment not found" });
        }

        await commentModel.findByIdAndUpdate(commentId, { deletedAt: new Date() }, { new: true });

        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error('Error at deleting comment by ID: ', error);
        return res.status(500).json({ message: error.message });
    }
}

const getAllComments = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const search = req.query.search || "";
        const sort = req.query.sort || "-createdAt";
        const filter = { deletedAt: null };

        if (search) {
            filter.text = { $regex: search, $options: "i" };
        }

        const skip = (pageNumber - 1) * limitNumber;

        const comments = await commentModel.find(filter)
            .skip(skip)
            .limit(limitNumber)
            .sort(sort)
            .populate('user', 'username email')
            .populate('post', 'title');

        const totalRecords = await commentModel.countDocuments(filter);

        const paginationInfo = await paginationService.getPaginationData(pageNumber, limitNumber, totalRecords);

        return res.status(200).json({ message: "Comments fetched successfully", paginationInfo, comments });
    } catch (error) {
        console.error('Error at fetching comments with pagination: ', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createComment,
    getCommentById,
    updateCommentById,
    softDeleteCommentById,
    getAllComments
}
