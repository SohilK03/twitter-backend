const express = require("express");
const router = express.Router();
const passport = require("passport");
const Tweets = require("../Models/Tweets");

router.get(
  "/test",
  passport.authenticate(["jwt"], { session: false }),
  (req, res) => res.json({ message: "working fine" })
);

router.post(
  "/",
  passport.authenticate(["jwt"], { session: false }),
  (req, res) => {
    const newPost = new Tweets({
      text: req.body.text,
      name: req.body.name,
      user: req.user.id,
    });
    newPost
      .save()
      .then((post) => res.json(post))
      .catch((err) => res.json(err));
  }
);

router.get("/", (req, res) => {
  Tweets.find({})
    .sort({ date: -1 })
    .then((tweets) => res.json(tweets))
    .catch((err) => res.status(404).json(err));
});

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Tweets.updateOne({ _id: req.params.id }, { $inc: { likes: 1 } })
      .then((tweet) => res.status(200).json(tweet))
      .catch((err) => res.json(err));
  }
);

module.exports = router;
