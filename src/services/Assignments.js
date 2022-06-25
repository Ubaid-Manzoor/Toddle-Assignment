const mongoose = require("mongoose");
const moment = require("moment");

const AssignmentModel = require("../models/Assignments");
const SubmissionService = require("../services/Submissions");
const logger = require("../logger");

class Assignment {
  async find(id) {
    try {
      return AssignmentModel.findOne({ _id: mongoose.Types.ObjectId(id) });
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async create({
    description,
    published_at,
    list_of_students,
    deadline_date,
    status,
    created_by,
  }) {
    try {
      deadline_date = moment(deadline_date).unix();
      published_at = moment(published_at).unix();

      const assignment = await AssignmentModel.create({
        description,
        published_at,
        list_of_students,
        deadline_date,
        status,
        created_by,
      });
      // Create submission for all the students;
      await SubmissionService.createBulkSubmissions(
        list_of_students,
        assignment._id
      );
      return assignment;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async update(id, to_update) {
    try {
      const { deadline_date } = to_update;
      if (deadline_date)
        to_update["deadline_date"] = moment(deadline_date).unix();

      return AssignmentModel.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: to_update }
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async delete(id) {
    try {
      await AssignmentModel.deleteOne({ _id: mongoose.Types.ObjectId(id) });
      // Now delete all the submission related to this Assignment
      const submission_response = await SubmissionService.delete({
        assignment_id: id,
      });
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async feed({ user_type, username, status }) {
    try {
      let response = [];
      if (user_type === "teacher") {
        response = await AssignmentModel.find({ created_by: username, status });
      } else if (user_type === "student") {
        const student_submissions = await SubmissionService.find({
          student_name: username,
          status,
        });
        const assignment_ids = student_submissions.map(
          (data) => data["assignment_id"]
        );

        response = await AssignmentModel.find({ _id: { $in: assignment_ids } });
      }
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

module.exports = new Assignment();
