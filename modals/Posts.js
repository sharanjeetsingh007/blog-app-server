const mongoose = require('mongoose');

const Posts = mongoose.model("Posts", new mongoose.Schema({

    title: {
        type: String,
        required: true,
        min: 3
    },
    username: {
        type: String,
        required: true,

    },
    category: {
        type: String,
        required: true,
        min: 3
    },
    backgroundImage: {
        type: String,
        required: true,
        min: 3
    },
    body: {
        type: String,
        required: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        min: 3
    },

    date: {
        type: Date,
        default: Date.now
    },
}))

module.exports = Posts;