const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  images: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Story", StorySchema);
