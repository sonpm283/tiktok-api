const VideoService = require("../services/video.service");
const { CREATED } = require("../core/success.response");

class VideoController {
  createNew = async (req, res, next) => {
    new CREATED({
      message: "Video created successfully",
      metadata: await VideoService.createNew(req.body),
    }).send(res);
  }
}

module.exports = new VideoController();
