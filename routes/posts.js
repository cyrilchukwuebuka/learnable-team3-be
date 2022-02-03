const router = require("express").Router();
var formidable = require('formidable');

//import contollers
const postController = require("../controllers/post");
// import user model
const User = require("../models/User");
require('dotenv').config()
const cloudinary = require("cloudinary");

// Cloudinary configuration settings
// This will be fetched from the .env file in the root directory
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


// Upload a new image
router.post("/", async (req, res) => {


    // The Image To Upload
    const theImageToUpload = req.body.image;

    console.log(theImageToUpload);
    // Confirm that the image is not empty
    if (theImageToUpload === undefined) {
        res.status(400).json({
            message: "Image is empty",
            statuscode: 400,
            status: 'error'
        });
    }

    // Post Description
    const postDescription = req.body.description;
    //confirm postdescription is not empty
    if (!postDescription) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "Post description is required"
        });
    }
    //confirm postdescription is less than 500 characters
    if (postDescription.length > 500) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "Post description cannot be more than 500 characters"
        });
    }

    // User Id
    const username = req.body.username;
    //confirm userId is not empty
    if (!username) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "User Id is required"
        });
    }



    // Upload image to cloudinary
    const results = await cloudinary.uploader.upload(
        theImageToUpload, {
            folder: "instagram-clone"
        });

        console.log(results);


        // called contoller
    const image = await postController.uploadNewPost(
        username,
        postDescription,
        results.url,
    );
    console.log(image);
    if (image.status === "success") {
        res.status(200).json(image);
    } else if (image.status === "error") {
        res.status(400).json(image);
    } else {
        res.status(500).json(image);
    }
})



// Get All Images
router.get("/getallimages", async (req, res) => {
    var allPosts = await postController.getAllImages();

    res.status(200).json({
        message: "All images fetched",
        statuscode: 200,
        status: 'success',
        posts: allPosts

    });
});






// Like a post
router.put("/like", async (req, res) => {
    const postId = req.body.postId;
    //confirm postId is not empty
    if (!postId) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "Post Id is required"
        });
    }

    const username = req.body.username;
    //confirm userId is not empty
    if (!username) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "User Name is required"
        });

    }

    const like = await postController.like(postId, username);
    if (like.status === "success") {
        res.status(200).json(like);
    } else if (like.status === "error") {
        res.status(400).json(like);
    } else {
        res.status(500).json(like);
    }
});




// Unlike a post
router.put("/unlike", async (req, res) => {
    const postId = req.body.postId;
    //confirm postId is not empty
    if (!postId) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "Post Id is required"
        });
    }

    const username = req.body.username;
    //confirm userId is not empty
    if (!username) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "User Name is required"
        });

    }

    const unlike = await postController.unlike(postId, username);

    if (unlike.status === "error") {
        return res.status(400).json(unlike);
    } else if (unlike.status === "success") {
        return res.status(200).json(unlike);
    } else {
        return res.status(500).json(unlike);

    }
});




module.exports = router;