const mongoose = require("mongoose");

const connDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connect to MongoDB Atlas");
    } catch (err) {
        console.log(err);
    }
}

module.exports = connDB;