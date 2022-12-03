const mongoose = require('mongoose');

const Comments = mongoose.model("Comments", new mongoose.Schema({
    CommnetUserUsername: {
        type: String,
        required: true,
    },
    commentUserProfilePic: {
        type: String,

    },
    commentUserEmail: {
        type: String,
        required: true,
        min: 3
    },
    body: {
        type: String,
        required: true,
        min: 3
    },
    postId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
}))

module.exports = Comments;