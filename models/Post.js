const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            max: 500
        },
        imgUrl: {
            type: String
        },
        likes: {
            type: Number
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
