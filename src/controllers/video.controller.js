const VideoService = require("../services/video.service");
const { CREATED, OK, SuccessResonse } = require("../core/success.response");

class VideoController {
  createNew = async (req, res, next) => {
    new CREATED({
      message: "Video upload successfully",
      metadata: await VideoService.createNew(req),
    }).send(res);
  };

  getList = async (req, res, next) => {
    new SuccessResonse({
      message: "Get all video successfully",
      metadata: await VideoService.getList(req),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResonse({
      message: "Delete video successfully",
      metadata: await VideoService.removeById(req),
    }).send(res);
  };

  like = async (req, res, next) => {
    new SuccessResonse({
      message: "Like video successfully",
      metadata: await VideoService.likeVideo(req),
    }).send(res);
  };

  unlike = async (req, res, next) => {
    new SuccessResonse({
      message: "Unlike video successfully",
      metadata: await VideoService.unLikeVideo(req),
    }).send(res);
  };

  getVideosByUserId = async (req, res, next) => {
    new SuccessResonse({
      message: "Get videos successfully",
      metadata: await VideoService.getVideosByUserId(req),
    }).send(res);
  };

  getVideoById = async (req, res, next) => {
    new SuccessResonse({
      message: "Get video successfully",
      metadata: await VideoService.getVideoById(req),
    }).send(res);
  };
}

module.exports = new VideoController();
