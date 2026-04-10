const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },

  image: String,

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);