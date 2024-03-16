"use strict";

// generate router
const express = require("express");
const { apiKey, permission } = require("../middlewares/checkAuth");
const router = express.Router();

//check api key
router.use(apiKey);
//check permission
router.use(permission("0000"));

// muốn vào được các api thì phải vượt qua check api key và check permission
router.use("/v1/api", require("./user"));
router.use("/v1/api", require("./video"));
router.use("/v1/api", require("./access"));

module.exports = router;
