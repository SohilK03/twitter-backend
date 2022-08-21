const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tweetsSchema = mongoose.Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "user" },
    text: { type: String, required: true },
    img: {
      data: Buffer,
      contentType: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { strict: false }
);

module.exports = mongoose.model("tweets", tweetsSchema);
