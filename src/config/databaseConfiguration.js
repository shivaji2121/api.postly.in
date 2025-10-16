const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("connected DB");
    } catch (error) {
        console.log("Unable to connected DB");
    }
}

module.exports = connectDb;