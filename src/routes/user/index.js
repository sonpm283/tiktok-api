"use strict";

const router = require("express").Router();
const { authentication } = require("../../auth/authUtils");
const userController = require("../../controllers/user.controller");
const { asyncHandler } = require("../../helpers/anyncHandler");

// Search user by name
router.get(
  "/user/search",
  // authentication,
  asyncHandler(userController.search)
);
module.exports = router;
