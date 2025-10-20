const mongoose = require('mongoose');
const postModel = require('./post.model');
const userModel = require('./user.model');

const commentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: [true, "Comment cannot be empty"],
            trim: true,
            maxLength: 200,
        },
    },
    { timestamps: true }
);

// When comment is created
commentSchema.post("save", async function (doc, next) {

    await postModel.updateOne({ _id: doc.post }, { $push: { comments: doc._id }, $inc: { commentsCount: 1 } });

    await userModel.updateOne({ _id: doc.user }, { $push: { comments: doc._id }, $inc: { commentsCount: 1 } });

    next();
});

// When individual comment is deleted
commentSchema.post("findByIdAndDelete", async function (doc, next) {

    if (doc) {
        await postModel.updateOne({ _id: doc.post }, { $pull: { comments: doc._id }, $inc: { commentsCount: -1 } });

        await userModel.updateOne({ _id: doc.user }, { $pull: { comments: doc._id }, $inc: { commentsCount: -1 } });
    }

    next();
});

const commentModel = mongoose.model('Comment', commentSchema);
module.exports = commentModel;