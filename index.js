const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
// const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();

const port = 8800;

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
// app.use("/api/posts", postRoute);

mongoose.connect(process.env.MONGODB_URL_TEST,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => app.listen(port, () => console.log(`Server is running on Port: ${port}`)))
    .catch(err => console.log(err))

// app.listen(8800, () => {
//     console.log("Backend server is running");
// });