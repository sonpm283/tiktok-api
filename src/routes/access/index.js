"use strict";

// generate router
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/anyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//signup
router.post("/user/signup", asyncHandler(accessController.signUp));
router.post("/user/login", asyncHandler(accessController.login));

//logout
router.post(
  "/user/logout",
  authentication,
  asyncHandler(accessController.logout)
);

//refresh token
router.post(
  "/user/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
