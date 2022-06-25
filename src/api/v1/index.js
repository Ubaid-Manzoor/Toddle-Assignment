const express = require("express");
const jwt = require("jsonwebtoken");
const userApi = require("./Users");
const assignmentApi = require("./Assignments");
const submissionApi = require("./Submissions");
const logger = require("../../logger");

const router = express.Router();
const Authentication = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {
      if (error) return res.sendStatus(403);
      req.user = data;
      next();
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

router.use("/user", userApi);
router.use(Authentication);
router.use("/assignment", assignmentApi);
router.use("/submission", submissionApi);

module.exports = router;
