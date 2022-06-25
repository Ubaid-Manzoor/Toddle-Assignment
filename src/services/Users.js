const { google } = require("googleapis");
const logger = require("../logger");
const CONSTANTS = require("../config/constants");
const jwt = require("jsonwebtoken");

class Users {
  constructor() {}

  login({ username, user_type }) {
    return jwt.sign(
      {
        username,
        user_type,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
  }
}

module.exports = new Users();
