const express = require("express");
const jwt = require("jsonwebtoken");
const UserService = require("../../services/Users");
const logger = require("../../logger");

const router = express.Router();

const loginDataCheck = (req, res, next) => {
  try {
    const { username, password, user_type } = req.body;
    if (!username) throw Error("username should be present");
    if (!password) throw Error("password should be present");
    if (!user_type || !["teacher", "student"].includes(user_type.toLowerCase()))
      throw Error("user_type should be teacher or student only");

    next();
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

// CREATED A MOCK LOGIC ROUTE AS MENTIONED IN ASSIGNMENT
router.post("/login", loginDataCheck, async (req, res, next) => {
  try {
    logger.info("@API /login");
    const { username, user_type } = req.body;
    const access_token = UserService.login({ username, user_type });

    res.json({
      access_token,
    });
  } catch (error) {
    logger.error(error);
  }
});

module.exports = router;
