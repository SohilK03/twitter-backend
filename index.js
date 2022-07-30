const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const { PORT, mongo_uri } = require("./config/config");
const userRoutes = require("./Routes/userRoutes.js");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose
  .connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
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
app.listen(process.env.PORT || PORT, (req, res) => {
  console.log(`Server Running on ${process.env.PORT || PORT}`);
});
