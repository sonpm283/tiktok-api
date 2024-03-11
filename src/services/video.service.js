"use strict";
import videoModel from "../models/video.model";

class VideoService {
  static createNew = async (data) => {
    const video = await videoModel.create(data);
    return video;
  };
}

module.exports = VideoService;