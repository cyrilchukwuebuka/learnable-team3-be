const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.send(
        {
            "status": "success",
            "message": "Welcome to user auth page",
        }
    );
});

router.post("/register", async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //save user and respond
        const savedUser = await newUser.save();
        res.status(201).json({
            "status": "success",
            "message": "account created",
            "data": {
                "email": newUser.email,
                "username": newUser.username,
                "_id": newUser._id,
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(404).json('user not found');

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json('wrong password');

        res.status(200).json({
            "status": "success",
            "message": "login successful",
            "data": {
                "username": req.body.username
            }
        })
    } catch (e) {
        res.status(500).json(e)
    }
})


module.exports = router;
