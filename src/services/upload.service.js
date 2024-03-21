"use strict";
const cloudinary = require("../configs/cloudinary");

class UploadService {
  static upload = async (req) => {
    if (!req.file) {
      throw new Error("No file uploaded");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "image",
    });

    return result.url;
  };
}

module.exports = UploadService;
