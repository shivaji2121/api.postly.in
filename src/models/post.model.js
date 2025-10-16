const mongoose = require('mongoose');


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
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

postSchema.pre('findByIdAndRemove', async function (next) {
    await userModel.updateOne({ _id: this.user }, { $pull: { posts: this._id } });
    next();
});

const postModel = mongoose.model('Posts', postSchema);

module.exports = postModel;