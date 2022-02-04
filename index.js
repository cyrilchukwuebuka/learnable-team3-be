const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts")
const fileupload = require('express-fileupload');

app.use(fileupload({
    useTempFiles: true,
}));

dotenv.config();
// Port our server is listening on
const PORT = process.env.PORT;

if (PORT == null || PORT == "") {
    PORT = 5000;
}

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// Not found route - 404
app.use("**", (req, res) => {
    res.status(404).send({
        message: "Route not found"
    })
})

mongoose.connect(process.env.MONGODB_URL_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => app.listen(PORT))
    .catch(err => console.log(err))