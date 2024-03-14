"use strict";

const router = require("express").Router();
const { authentication } = require("../../auth/authUtils");
const storage = require("../../configs/multer");
const videoController = require("../../controllers/video.controller");
const { asyncHandler } = require("../../helpers/anyncHandler");

router.get("/videos", asyncHandler(videoController.getList));

router.post(
  "/videos/upload",
  authentication,
  storage.single("file"),
  asyncHandler(videoController.createNew)
);

router.delete(
  "/videos/delete/:id",
  authentication,
  asyncHandler(videoController.delete)
);

module.exports = router;
