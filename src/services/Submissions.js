const SubmissionModel = require("../models/Submissions");
const logger = require("../logger");

class Submission {
  /**
   * It returns a list of submissions that match the filter
   * @param filter - This is the filter object that you pass to the find method.
   * @returns An array of submissions
   */
  async find(filter) {
    try {
      return SubmissionModel.find(filter);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  
 /**
  * It updates the status of the submission to "SUBMITTED" for the given assignment_id and username
  * @param data - {
  * @returns The updated submission
  */
  async submit(data) {
    try {
      const { assignment_id, username } = data;
      return await SubmissionModel.updateOne(
        { student_name: username, assignment_id },
        { $set: { status: "SUBMITTED" } }
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   * It takes a list of students and an assignment id, and creates a submission for each student in the
   * list
   * @param list_of_students - An array of student names
   * @param assignment_id - The id of the assignment that you want to create submissions for.
   */
  async createBulkSubmissions(list_of_students, assignment_id) {
    let bulk_insert_query = [];
    for (const student_name of list_of_students) {
      bulk_insert_query.push({
        insertOne: {
          document: {
            student_name,
            assignment_id,
            status: "PENDING",
          },
        },
      });

      if (bulk_insert_query.length === 30) {
        await SubmissionModel.bulkWrite(bulk_insert_query);
        bulk_insert_query = [];
      }
    }
    await SubmissionModel.bulkWrite(bulk_insert_query);
  }

  /**
   * It deletes all the submissions that match the filter
   * @param filter - This is the filter that will be used to find the submissions that will be deleted.
   * @returns The result of the deleteMany function.
   */
  async delete(filter) {
    try {
      return await SubmissionModel.deleteMany(filter);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

module.exports = new Submission();
