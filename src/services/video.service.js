"use strict";

const videoModel = require("../models/video.model");
const cloudinary = require("../configs/cloudinary");
const { BadRequestError } = require("../core/error.response");
const { Types } = require("mongoose");

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
      user_id: req.userId,
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

  static getList = async (req) => {
    /*
      1. Get the limit from req.query
      2. Get the page from req.query
      3. Calculate skip = (page - 1) * limit
      4, Get total documents in the videos collection
      5, Return videos data and pagination
    */
    const PAGE_SIZE = 5;
    const DEFAULT_PAGE = 1;

    const { _page, _limit } = req.query;
    const limit =
      _limit && !isNaN(Number(_limit)) && Number(_limit) > 0
        ? parseInt(_limit)
        : PAGE_SIZE;
    const page =
      _page && !isNaN(Number(_page)) && Number(_page) > 0
        ? parseInt(_page)
        : DEFAULT_PAGE;
    const skip = (page - 1) * limit;
    const query = {};

    const videos = await videoModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // join user collection
    await videoModel.populate(videos, {
      path: "user_id",
      select: "name avatar",
    });

    // get total documents in the videos collection
    const count = await videoModel.countDocuments(query);

    if (!videos) throw new BadRequestError("No video found!");

    if (videos) {
      return {
        code: 200,
        metadata: videos,
        pagination: {
          total: count,
          limit: limit,
          page: page,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  static removeById = async (req) => {
    // lấy id từ req.params
    const { id } = req.params;

    // tìm video trong db theo id
    const video = await videoModel.findById(id);

    // nếu user không phải là người upload video thì không cho xoá
    if (video.user_id.toString() !== req.userId) {
      throw new BadRequestError("You are not authorized to delete this video!");
    }

    // xoá video trong db
    const deletedVideo = await videoModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    return {
      code: 200,
      metadata: deletedVideo,
    };
  };

  static likeVideo = async (req) => {
    const videoId = req.params.id;
    const userId = req.userId;

    // kiểm tra xem user đã like video này chưa
    const video = await videoModel.findOne({
      _id: new Types.ObjectId(videoId),
      likes: { $in: [userId] },
    });

    if (video) throw new BadRequestError("You already liked this video!");

    return await videoModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(videoId),
      },
      {
        // thêm userId(req.userId) vào mảng likes
        $push: {
          likes: new Types.ObjectId(userId),
        },
      }
    );
  };

  static unLikeVideo = async (req) => {
    const videoId = req.params.id;
    const userId = req.userId;

    // kiem tra xem user da like video nay chua
    const video = await videoModel.findOne({
      _id: new Types.ObjectId(videoId),
      likes: { $in: [userId] },
    });

    if (!video) throw new BadRequestError("You haven't liked this video yet!");

    // nếu đã like thì xoá userId(req.userId) khỏi mảng likes
    return await videoModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(videoId),
      },
      {
        // xoá userId(req.userId) khỏi mảng likes
        $pull: {
          likes: new Types.ObjectId(userId),
        },
      }
    );
  };
}

module.exports = VideoService;
