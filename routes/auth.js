const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.send("Welcome to user auth page");
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
        console.log(22)
        const savedUser = await newUser.save();
        console.log('step 1')
        res.status(201).json({
            "status": "success",
            "message": "account created",
            "data": {
                "status": "success",
                "message": "account created",
                "data": {
                    "email": req.body.email,
                    "username": req.body.username
                }
            }
        });
        // res.status(201).json('success');
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
