"use strict";

const videoModel = require("../models/video.model");
const cloudinary = require("../configs/cloudinary");

class VideoService {
  static createNew = async (req) => {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "video",
    });

    const newVideo = await videoModel.create({
      name: req.file.originalname,
      media_url: result.url,
      content: req.body.content,
      cloudinary_id: result.public_id,
      user_id: req.body.user_id,
    });

    if (!newVideo) {
      throw new BadRequestError("Upload failed!");
    }

    if (newVideo) {
      return {
        code: 201,
        metadata: newVideo,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  static getAll = async () => {
    const videos = await videoModel.find().lean();
    if (!videos) throw new BadRequestError("No video found!");

    if (videos) {
      return {
        code: 200,
        metadata: videos,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = VideoService;
