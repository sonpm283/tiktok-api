const VideoService = require("../services/video.service");
const { CREATED, OK } = require("../core/success.response");

class VideoController {
  createNew = async (req, res, next) => {
    new CREATED({
      message: "Video created successfully",
      metadata: await VideoService.createNew(req),
    }).send(res);
  };

  getList = async (req, res, next) => {
    new OK({
      message: "Get all video successfully",
      metadata: await VideoService.getList(req),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new OK({
      message: "Delete video successfully",
      metadata: await VideoService.removeById(req),
    }).send(res);
  };

  like = async (req, res, next) => {
    new OK({
      message: "Like video successfully",
      metadata: await VideoService.likeVideo(req),
    }).send(res);
  };

  unlike = async (req, res, next) => {
    new OK({
      message: "Unlike video successfully",
      metadata: await VideoService.unLikeVideo(req),
    }).send(res);
  };
}

module.exports = new VideoController();
