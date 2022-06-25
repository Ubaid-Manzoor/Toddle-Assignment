const express = require("express");
const cors = require("cors");

const api = require("./src/api");

require("dotenv").config({
  path: `${__dirname}/.env.${process.env.NODE_ENV}`,
});

const CONSTANTS = require("./src/config/constants");
require("./src/utils/dbConnect").connectMongo();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", api);

app.listen(CONSTANTS.PORT || 3000, () => {
  console.log("connected to 3000");
});
