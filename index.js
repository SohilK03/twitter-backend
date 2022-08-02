const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const { PORT, mongo_uri } = require("./config/config.js");
const userRoutes = require("./Routes/userRoutes.js");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected To DB"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport Config

require("./config/passport.js")(passport);
app.get("/", (req, res) => {
  res.send("Hello, Twitter Backend Running");
});

app.use("/users", userRoutes);
// app.use(
//   "/users",
//   createProxyMiddleware({
//     target: "http://localhost:3000/api",
//     changeOrigin: true,
//   })
// );
app.listen(PORT, (req, res) => {
  console.log(`Server Running on ${process.env.PORT || PORT}`);
});
