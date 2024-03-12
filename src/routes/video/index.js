"use strict";

const router = require("express").Router();
const storage = require("../../configs/multer");
const videoController = require("../../controllers/video.controller");
const { asyncHandler } = require("../../helpers/anyncHandler");

router.post(
  "/uploadVideo",
  storage.single("file"),
  asyncHandler(videoController.createNew)
);
router.get("/getAllVideo", asyncHandler(videoController.getAll));

module.exports = router;
