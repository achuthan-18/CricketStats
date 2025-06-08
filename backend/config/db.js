const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Connected Successfully!"))
        .catch(e => console.log(e));
}

module.exports = connectDB;