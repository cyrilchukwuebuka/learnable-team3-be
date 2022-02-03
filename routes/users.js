const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.get("/", (req, res) => {
    res.send("Welcome to user user page");
});

router.get("/:username", async (req, res) => {
    try {
        const user = await User
                .findOne({ username: req.params.username})
                .populate('posts')
                .select('-password')

        res.status(200).json({
            "status" : "success",
            "message" : "user gotten",
            "data": user
        })
    } catch (err) {
        res.status(500).json(err);
    }
})

//Follow a User
router.put("/:username/follow", async (req, res) => {
    if (req.body.username !== req.params.username) {
        try {
            const currentUser = await User.findOne({ username: req.body.username });
            if (!currentUser.following.includes(req.params.username)) {
                await currentUser.updateOne({ $push: { following: req.params.username } });
                console.log('step 3')
                res.status(200).json({
                    "status": "success",
                    "message": "user has been followed",
                    "data": {
                        "username": req.params.username
                    }
                });
            } else {
                res.status(403).json("You already follow the user");
            }
        } catch(err){
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
});

//unfollow a User
router.put("/:username/unfollow", async (req, res) => {
    if (req.body.username !== req.params.username) {
        try {
            const currentUser = await User.findOne({ username: req.body.username });
            if (currentUser.following.includes(req.params.username)) {
                await currentUser.updateOne({ $pull: { following: req.params.username } });
                res.status(200).json({
                    "status": "success",
                    "message": "user has been unfollowed",
                    "data": {
                        "username": req.params.username
                    }
                });
            } else {
                res.status(403).json("You already unfollowed the user");
            }
        } catch(err){
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
});

module.exports = router;