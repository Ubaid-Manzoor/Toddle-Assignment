const express = require("express");
const v1Apis = require("./v1");

const router = express.Router();

router.use("/v1", v1Apis);

module.exports = router;
