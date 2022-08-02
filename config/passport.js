const mongoose = require("mongoose");
const User = mongoose.model("user");
const {
  secretOrKey,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = require("./config");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretOrKey || secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ id: jwt_payload.sub }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/users/auth/google/callback",
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile._json.email }, function (err, user) {
          if (user) return done(err, user);
          else {
            console.log("User not found creating new");
            const u = new User({
              ...profile._json,
              password: profile.sub,
              google: true,
            }).save();
            return done(err, u);
          }
        });
      }
    )
  );
};
