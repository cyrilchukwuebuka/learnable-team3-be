const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")

router.get("/", (req, res) => {
    res.send(
        {
            "status": "success",
            "message": "Welcome to user user page",
        }
        
        );
});

//Get User by Username including Posts
router.get("/:username", async (req, res) => {
    try {
        const user = await User
            .findOne({
                username: req.params.username
            })
            .populate('posts')
            .select('-password')

        res.status(200).json({
            "status": "success",
            "message": "user gotten",
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
            const currentUser = await User.findOne({
                username: req.body.username
            });
            if (!currentUser.following.includes(req.params.username)) {
                await currentUser.updateOne({
                    $push: {
                        following: req.params.username
                    }
                });
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
        } catch (err) {
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
            const currentUser = await User.findOne({
                username: req.body.username
            });
            if (currentUser.following.includes(req.params.username)) {
                await currentUser.updateOne({
                    $pull: {
                        following: req.params.username
                    }
                });
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
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
});

//Begin Forgot Password
router.put("/forgotpassword", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        })
        if (!user) {
            res.status(500).json("user does not exist");
        } else {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'team3genesys@gmail.com',
                    pass: '!!!1234abc!!!'
                }
            })
            const mailOptions = {
                from: 'team3genesys@gmail.com',
                to: user.email,
                subject: 'Start Forgot Password',
                text: 'https://google.com'
            }
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    res.status(500).json(err.message);
                } else {
                    res.status(200).json({
                        "status": "success",
                        "message": "email sent",
                        "data": {
                            "username": user.username
                        }
                    })
                }
            })
        }

    } catch (err) {
        res.status(500).json(err.stack);
    }
})

router.put("/resetpassword", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        })
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        await user.updateOne({
            password: hashedPassword
        })

        res.status(200).json({
            "status": "success",
            "message": "password reset successful",
            "data": {
                "username": req.body.username
            }
        });

    } catch (err) {

    }
})
module.exports = router;