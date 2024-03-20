"use strict";

// generate router
const express = require("express");
const storage = require("../../configs/multer");
const uploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../helpers/anyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//upload
router.post(
  "/upload",
  authentication,
  storage.single("file"),
  asyncHandler(uploadController.upload)
);

module.exports = router;
