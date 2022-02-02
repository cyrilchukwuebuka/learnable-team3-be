const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.get("/", (req, res) => {
    res.send("Welcome to user user page");
});

//Follow a User
router.put("/:username/follow", async (req, res) => {
    if (req.body.username !== req.params.username) {
        try {
            const currentUser = await User.findOne({ username: req.body.username });
            console.log('step 1')
            if (!currentUser.following.includes(req.params.username)) {
                console.log('step 2')
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

module.exports = router;