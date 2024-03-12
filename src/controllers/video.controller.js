const VideoService = require("../services/video.service");
const { CREATED, OK } = require("../core/success.response");

class VideoController {
  createNew = async (req, res, next) => {
    new CREATED({
      message: "Video created successfully",
      metadata: await VideoService.createNew(req),
    }).send(res);
  };

  getAll = async (req, res, next) => {
    new OK({
      message: "Get all video successfully",
      metadata: await VideoService.getAll(),
    }).send(res);
  };
}

module.exports = new VideoController();
