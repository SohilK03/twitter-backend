const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { secretOrKey } = require("../config/config");
// @route GET users/test
// @desc Test user routes
// @access Public
router.get("/test", (req, res) =>
  res.status(200).json({ message: "User Routes Working" })
);

// @route GET users/reigster
// @desc Register new user
// @access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) res.status(400).json({ email: "Email ALready Exists" });
      else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.status(200).json(user))
              .catch((err) => res.status(400).json(err));
          });
        });
      }
    })
    .catch((err) => res.status(400).json(err));
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = {};
  // Find User by email
  User.findOne({ email: email })
    .then((user) => {
      // Check for user
      if (!user) {
        errors.email = "User not found";
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User Matched

          // JWT Payload creation
          const payload = {
            id: user._id,
            name: user.name,
          };

          // Sign the token
          jwt.sign(
            payload,
            secretOrKey,
            { expiresIn: 3600 },
            function (err, token2) {
              if (err) console.log(err);
              else {
                res
                  .status(200)
                  .json({ success: true, token: "Bearer " + token2 });
              }
            }
          );
        } else {
          errors.password = "Password is incorrect";
          return res.status(400).json(errors);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get(
  "/current",
  passport.authenticate(["jwt"], { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate(["google"], {
    session: false,
  }),
  (req, res) => {
    if (req.user) {
      console.log("Inside call back : " + req.user);
      const payload = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      };
      jwt.sign(
        payload,
        secretOrKey,
        { expiresIn: 3600 },
        function (err, token2) {
          if (err) console.log(err);
          else {
            res.redirect(`http://localhost:3000/${token2}`);
          }
        }
      );
    } else
      res
        .status(400)
        .json({ error: "Authorization Error" })
        .redirect("http://localhost:3000/");
  }
);
router.get("/auth/google/token", (req, res) => {});
module.exports = router;
