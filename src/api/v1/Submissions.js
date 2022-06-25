const express = require("express");
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

const submitApiDataCheck = (req, res, next) => {
  try {
    const { assignment_id } = req.body;

    if (!assignment_id) throw Error("assignment_id should be present");
    next();
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

router.post(
  "/submit",
  authenticate("student"),
  submitApiDataCheck,
  async (req, res, next) => {
    try {
      logger.info("@API /search");
      const { assignment_id } = req.body;
      const { username } = req.user;
      const response = await SubmissionService.submit({
        assignment_id,
        username,
      });
      res.json(response);
    } catch (error) {
      logger.error(error);
    }
  }
);

router.get("/", async (req, res) => {
  try {
    logger.info("@API /search");
    res.json({
      message: "done",
    });
  } catch (error) {
    logger.error(error);
  }
});

module.exports = router;
