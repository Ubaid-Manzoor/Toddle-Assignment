const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  description: String,
  published_at: Number,
  deadline_date: Number,
  status: String,
  created_by: String,
});

module.exports = mongoose.model("assignments", AssignmentSchema);
