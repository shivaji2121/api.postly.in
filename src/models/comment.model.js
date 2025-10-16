const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
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


commentSchema.post("save", async function (doc, next) {
    await postModel.updateOne({ _id: doc.post }, { $push: { comments: doc._id } });
    await userModel.updateOne({ _id: doc.user }, { $push: { comments: doc._id } });
    next();
});
const commentModel = mongoose.model('Comment', commentSchema);
module.exports = commentModel;
