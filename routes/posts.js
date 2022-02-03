const router = require("express").Router();
var formidable = require('formidable');

//import contollers
const postController = require("../controllers/posts");


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


// Upload a new image
router.post("/upload", async (req, res) => {
    const theImageToUpload = req.body.image;
    // Confirm that the image is not empty
    if (theImageToUpload === undefined) {
        res.status(400).json({
            message: "Image is empty",
            statuscode: 400,
            status: 'error'
        });
    }

    const postDescription = req.body.description;
    // Post Description
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
    const userId = req.body.userId;
    //confirm userId is not empty
    if (!userId) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "User Id is required"
        });
    }

    const image = postController.uploadNewPost(
        userId,
        postDescription,
        theImageToUpload,
    );

    if (image.status === "success") {
        res.status(200).json(image);
    } else if (image.status === "error") {
        res.status(400).json(image);
    } else {
        res.status(500).json(image);
    }
})





// Like a post
router.post("/like", async (req, res) => {
    const postId = req.body.postId;
    //confirm postId is not empty
    if (!postId) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "Post Id is required"
        });
    }

    const userId = req.body.userId;
    //confirm userId is not empty
    if (!userId) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "User Id is required"
        });

    }

    const like = await postController.like(postId, userId);
    if (like.status === "success") {
        res.status(200).json(like);
    } else if (like.status === "error") {
        res.status(400).json(like);
    } else {
        res.status(500).json(like);
    }
});




// Unlike a post
router.post("/unlike", async (req, res) => {
    const postId = req.body.postId;
    //confirm postId is not empty
    if (!postId) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "Post Id is required"
        });
    }

    const userId = req.body.userId;
    //confirm userId is not empty
    if (!userId) {
        return res.status(400).send({
            status: "error",
            statuscode: 400,
            message: "User Id is required"
        });

    }

    const unlike = await postController.unlike(postId, userId);

    if (unlike.status === "error") {
        return res.status(400).json(unlike);
    } else if (unlike.status === "success") {
        return res.status(200).json(unlike);
    } else {
        return res.status(500).json(unlike);

    }
});




module.exports = router;