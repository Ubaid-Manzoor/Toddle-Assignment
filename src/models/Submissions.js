const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  student_name: String,
  assignment_id: String,
  status: String,
});

module.exports = mongoose.model("submissions", SubmissionSchema);
