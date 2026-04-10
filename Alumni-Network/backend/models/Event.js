const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: String,

  date: Date,

  location: String,

  organizer: String,

  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);