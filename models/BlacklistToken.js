const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("BlacklistToken", blacklistSchema);
