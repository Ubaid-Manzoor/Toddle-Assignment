const winston = require("winston");

// JUST A BASIC LOGGER | we can also build more complex
const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
