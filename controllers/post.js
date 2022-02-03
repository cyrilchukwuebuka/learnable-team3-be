// Import Post Model
const Post = require("../models/Post");

// Import User Model
const User = require("../models/User");


// Post Controller
const post = {};

// Create A new post and upload image to cloudinary
post.uploadNewPost = async (
    username,
    postDescription,
    imageUrl
) => {
    try {
        // Confirm username exists
        console.log("user: " + username);
        const user = await User.findOne({
            username: username
        });

        if (!user) {
            return {
                status: "errors",
                statuscode: 400,
                message: "Username does not exist"
            };
        }


        // Create a new post
        const newPost = new Post({
            username: username,
            description: postDescription,
            image: imageUrl
        });
        await newPost.save();

        await User.findOneAndUpdate({
            username: username
        }, {
            $push: {
                posts: newPost._id
            }
        });
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
post.like = async (
    postId,
    username
) => {
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
            error: error.message
        };
    }

}


// Unlike a post
post.unlike = async (
    postId,
    username
) => {
    // Remove user from list of post likes
    try {
        const thePost = await Post.findById(postId);
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
            error: error.message
        };
    }
}


module.exports = post;