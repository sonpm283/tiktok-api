"use strict";

const router = require("express").Router();
const { authentication } = require("../../auth/authUtils");
const userController = require("../../controllers/user.controller");
const { asyncHandler } = require("../../helpers/anyncHandler");
const storage = require("../../configs/multer");

// Search user by name
router.get("/user/search", asyncHandler(userController.search));

// Get user list
router.get("/user/getUserList", asyncHandler(userController.getList));

router.get("/user/profile/:id", asyncHandler(userController.getInfo));

router.patch(
  "/user/:id/follow",
  authentication,
  asyncHandler(userController.follow)
);

router.patch(
  "/user/:id/unfollow",
  authentication,
  asyncHandler(userController.unFollow)
);

router.get(
  "/user/getFollowingsUser",
  authentication,
  asyncHandler(userController.getFollowUser)
);

router.patch(
  "/user",
  authentication,
  storage.single("file"),
  asyncHandler(userController.update)
);
module.exports = router;
