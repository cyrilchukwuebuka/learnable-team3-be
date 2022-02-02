const router = require("express").Router();
// const User = require("../models/User");
// const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.send("Welcome to user auth page");
});


module.exports = router;
