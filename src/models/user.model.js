const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'name must be 3 characters'],
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        minLength: [5, 'Email must be 5 characters']

    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [8, 'Password must be 8 characters']
    },
    profileImage: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        maxLength: 100,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }

    ],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    deletedAt: {
        type: Date,
        default: null
    },
    postsCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },

},
    { timestamps: true }
)

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, ({ expiresIn: '24h' }));
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;