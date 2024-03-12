"use strict";

// generate router
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/anyncHandler");
const router = express.Router();

//signup
router.post("/user/signup", asyncHandler(accessController.signUp));
router.post("/user/login", asyncHandler(accessController.login));

module.exports = router;
