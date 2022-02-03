const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    uploadersId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 500
    },
    image: {},
    likes: {
        type: Array,
        default: []
    }
}, {

    timestamps: true

});

module.exports = mongoose.model("Post", PostSchema);