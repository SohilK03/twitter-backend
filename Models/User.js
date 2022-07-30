const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
      required: true,
    },
    google: {
      type: Boolean,
      default: false,
    },
  },
  { strict: false }
);

module.exports = User = mongoose.model("user", UserSchema);
