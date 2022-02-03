// Import Post Model
const Post = require("../models/Post");

const cloudinary = require("cloudinary");
require('dotenv').config()

// Cloudinary configuration settings
// This will be fetched from the .env file in the root directory
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Post Controller
const post = {};

// Create A new post and upload image to cloudinary
post.uploadNewPost = async ({
    username,
    postDescription,
    image
}) => {
    try {
        // Upload image to cloudinary
        const imgStr = image
        const imageUrl = await cloudinary.uploader.upload(imgStr, {
                folder: "vibez_posts"
            });

        // Get Url of image and resize it
        // const imageUrlResized = await cloudinary.url(imageUrl.public_id, {
        //     width: 500,
        //     height: 600,
        //     crop: "fill"
        // });

       


        // Create a new post
        const newPost = new Post({
            username: username,
            description: postDescription,
            image: imageUrl.url
        });
        await newPost.save();
        return {
            status: "success",
            statuscode: 200,
            message: "Post created"
        };
    } catch (error) {

        return {
            status: "error",
            statuscode: 400,
            error: error
        }
    }
}

// Get all posts
post.getAllPost = async () => {
    try {
        const posts = await Post.find();
        return {
            status: "success",
            statuscode: 200,
            posts: posts
        };
    } catch (err) {
        return {
            status: "error",
            statuscode: 400,
            error: error
        };
    }
}


// Get All Post By User
post.getAllPostByusername = async ({
    username
}) => {
    try {
        const userPosts = await Post.find({
            username: username
        });
        return {
            status: "success",
            statuscode: 200,
            posts: userPosts
        };
    } catch (err) {
        return {
            status: "error",
            statuscode: 400,
            error: error
        };
    }
}


// Like a post
post.like = async ({
    username,
    postId
}) => {
    // Add user to list of post likes
    try {
        const thePost = await Post.findById(postId);
        await thePost.likes.push(username);
        await thePost.save();
        return {
            status: "success",
            statuscode: 200,
            message: "Post liked"
        };
    } catch (error) {
        return {
            status: "error",
            statuscode: 400,
            error: error
        };
    }

}


// Unlike a post
post.unlike = ({
    username,
    postId
}) => {
    // Remove user from list of post likes
    try {
        const thePost = Post.findById(postId);
        const index = thePost.likes.indexOf(username);
        thePost.likes.splice(index, 1);
        thePost.save();
        return {
            status: "success",
            statuscode: 200,
            message: "Post unliked"
        };
    } catch (error) {
        return {
            status: "error",
            statuscode: 400,
            error: error
        };
    }
}


module.exports = post;