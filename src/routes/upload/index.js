"use strict";

// generate router
const express = require("express");
// const upLoadController = require("../../controllers/upload.controller");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const multer = require("multer");
const cloundinary = require("../../configs/cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloundinary,
  folder: "uploads",
  alowedFormats: ["jpg", "png", "jpeg", "mp4"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});
const upload = multer({ storage: storage });

//signup
router.post(
  "/upload",
  upload.fields([{ name: "img", maxCount: 1 }]),
  asyncHandler((req, res) => {
    const url = req.files["img"][0];
    res.send(url);
  })
);

module.exports = router;
