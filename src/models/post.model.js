const mongoose = require('mongoose');
const userModel = require('./user.model');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'title must be 3 characters'],
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        default: "",
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    commentsCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });


postSchema.pre('findByIdAndDelete', async function (next) {
    const post = await this.model.findById(this._id);

    if (post) {
        await userModel.updateOne({ _id: post.user }, { $pull: { posts: post._id }, $inc: { postsCount: -1 } });
    }

    next();
});

const postModel = mongoose.model('Posts', postSchema);
module.exports = postModel;