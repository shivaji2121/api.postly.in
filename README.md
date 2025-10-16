// Using Mongoose for MongoDB
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Post Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    }
}, {
    timestamps: true
});

// Comment Schema
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    isEdited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

// Virtual for reply count
commentSchema.virtual('repliesCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
    count: true
});

// Middleware to update comment count on post
commentSchema.post('save', async function () {
    const Post = mongoose.model('Post');
    await Post.findByIdAndUpdate(this.post, {
        $inc: { commentsCount: 1 }
    });
});

commentSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const Post = mongoose.model('Post');
        await Post.findByIdAndUpdate(doc.post, {
            $inc: { commentsCount: -1 }
        });
    }
});

// Export models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { User, Post, Comment };