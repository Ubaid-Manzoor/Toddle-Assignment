const express = require("express");
const AssignmentService = require("../../services/Assignments");
const SubmissionService = require("../../services/Submissions");
const logger = require("../../logger");

const router = express.Router();

const authenticate = (role) => {
  return (req, res, next) => {
    const { user_type } = req.user;
    if (user_type !== role) return res.sendStatus(401);
    next();
  };
};

const createApiDataCheck = (req, res, next) => {
  try {
    const {
      description,
      published_at,
      list_of_students,
      deadline_date,
      status,
    } = req.body;

    if (!description) throw Error("description should be present");
    if (!published_at) throw Error("published_at should be present");
    if (!list_of_students || !Array.isArray(list_of_students))
      throw Error("list_of_students should be present / is not valid array");
    if (!deadline_date) throw Error("deadline_date should be present");
    if (!status) throw Error("status should be present");

    next();
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
router.post(
  "/create",
  authenticate("teacher"),
  createApiDataCheck,
  async (req, res) => {
    try {
      const {
        description,
        list_of_students,
        deadline_date,
        status,
        published_at,
      } = req.body;
      const { username } = req.user;

      const response = await AssignmentService.create({
        description,
        published_at,
        list_of_students,
        deadline_date,
        status,
        created_by: username,
      });
      res.json({ data: { id: response._id } });
    } catch (error) {
      logger.info(error);
      res.sendStatus(500);
    }
  }
);

router.patch("/update/:id", authenticate("teacher"), async (req, res) => {
  try {
    logger.info("@API /search");
    const { description, deadline_date, status } = req.body;
    const { id } = req.params;

    const to_update = {};
    if (description) to_update["description"] = description;
    if (deadline_date) to_update["deadline_date"] = deadline_date;
    if (status) to_update["status"] = status;

    await AssignmentService.update(id, to_update);

    res.json({
      data: {
        id,
      },
    });
  } catch (error) {
    logger.error(error);
  }
});

router.delete("/delete/:id", authenticate("teacher"), async (req, res) => {
  try {
    logger.info("@API /search");
    const { id } = req.params;
    await AssignmentService.delete(id);

    res.json({
      data: {
        id,
      },
    });
  } catch (error) {
    logger.error(error);
  }
});

router.get("/get/:id", authenticate("teacher"), async (req, res) => {
  try {
    logger.info("@API /search");
    const { id } = req.params;
    const response = await AssignmentService.find(id);
    res.json({
      data: response ?? [],
    });
  } catch (error) {
    logger.error(error);
  }
});

router.get("/submissions/:id", async (req, res) => {
  try {
    console.log("Submissions");
    const { id } = req.params;
    const { user_type, username } = req.user;

    console.log({ user_type, username });
    let response = [];
    if (user_type === "teacher") {
      response = await SubmissionService.find({
        assignment_id: id,
        status: "SUBMITTED",
      });
    } else if (user_type === "student") {
      response = await SubmissionService.find({
        assignment_id: id,
        student_name: username,
        status: "SUBMITTED",
      });
    }

    res.json({
      data: response ?? [],
    });
  } catch (error) {
    logger.error(error);
  }
});

router.get("/feed", async (req, res) => {
  try {
    const { user_type, username } = req.user;
    const { status } = req.body;
    const response = await AssignmentService.feed({
      user_type,
      username,
      status,
    });
    res.json(response);
  } catch (error) {
    logger.error(error);
    throw error;
  }
});
module.exports = router;
