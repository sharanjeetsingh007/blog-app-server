const mongoose = require('mongoose');

const Users = mongoose.model("Users", new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,

    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 200,
    },
    date: {
        type: Date,
        default: Date.now
    }
}))

module.exports = Users;