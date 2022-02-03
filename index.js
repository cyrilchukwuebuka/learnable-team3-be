const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
// const userRoute = require("./routes/users");rt

dotenv.config();
// Port our server is listening on
const PORT = process.env.PORT || 5000;
// try {
//     mongoose
//         .connect(process.env.MONGO_URL)
//         .then(() => console.log("connected to MongoDB"));
// } catch (err) {
//     console.log(err)
// }

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// app.use("/api/users", userRoute);
// app.use("/api/auth", authRoute);

// Api/Posts
app.use("/api/posts", require("./routes/posts"));

// Not found route - 404
app.use("**", (req, res) => {
    res.status(404).send({ message: "Route not found" })
})

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});