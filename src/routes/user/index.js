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
// Get user list
router.get(
  "/user/getUserList",
  // authentication,
  asyncHandler(userController.getList)
);

router.get(
  "/user/profile/:id",
  // authentication,
  asyncHandler(userController.getInfo)
);
module.exports = router;
