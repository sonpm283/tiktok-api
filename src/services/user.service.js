"use strict";

const userModel = require("../models/user.model");
// const cloudinary = require("../configs/cloudinary");
const { BadRequestError } = require("../core/error.response");
const UploadService = require("./upload.service");

// Get user list
const getUsers = async () => {
  const users = await userModel
    .find()
    .select("name email nickname tick")
    .sort({ createdAt: -1 })
    .lean();

  if (!users) BadRequestError("No users found");

  return users;
};

const followingsUser = async (req) => {
  // query all user followings
  const followingsUser = await userModel
    .findById(req.userId)
    .limit(10)
    .populate("followings", "name avatar nickname tick")
    .lean();

  if (!followingsUser) throw new BadRequestError("No user found!");

  return followingsUser;
};

const getUserInfo = async (req) => {
  const userId = req.params.id;

  const user = await userModel
    .findById(userId)
    .select("name avatar nickname tick followings followers")
    .lean();

  if (!user) throw new BadRequestError();

  return user;
};

// Find user by email
const findByEmail = async ({
  email,
  select = { email: 1, password: 1, name: 1, roles: 1 },
}) => {
  return await userModel.findOne({ email }).select(select).lean();
};

// Search user by name
const searchUser = async (req) => {
  const foundUser = await userModel
    .find({ name: { $regex: req.query.name, $options: "i" } }) // i for case-insensitive
    .limit(10)
    .select("name avatar nickname tick")
    .lean();

  if (!foundUser) throw new BadRequestError("No user found!");

  return foundUser;
};

//follow user
const follow = async (req) => {
  //1, kiểm tra xem user đã follow chưa
  const followed = await userModel
    .findOne({
      _id: req.params.id,
      followers: req.userId,
    })
    .lean();
  if (followed)
    throw new BadRequestError("You have already followed this user!");

  //2, thêm userId(req.userId) vào mảng followers
  const newUser = await userModel
    .findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          followers: req.userId,
        },
      },
      { new: true }
    )
    .populate("followers followings", "-password");

  //3, thêm req.params.id vào mảng followings
  await userModel.findOneAndUpdate(
    { _id: req.userId },
    {
      $push: {
        followings: req.params.id,
      },
    },
    { new: true }
  );

  return newUser;
};

//unFollow user
const unFollow = async (req) => {
  //1, kiểm tra xem user đã follow chưa
  const followed = await userModel.findOne({
    _id: req.params.id,
    followers: req.userId,
  });
  if (!followed)
    throw new BadRequestError("You haven't followed this user yet!");

  //2, xoá userId(req.userId) vào mảng followers
  const newUser = await userModel
    .findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          followers: req.userId,
        },
      },  
      { new: true }
    )
    .populate("followers followings", "-password");

  //3, xoá req.params.id vào mảng followings
  await userModel.findOneAndUpdate(
    { _id: req.userId },
    {
      $pull: {
        followings: req.params.id,
      },
    },
    { new: true }
  );

  return newUser;
};

// update user
const updateUser = async (req) => {
  const userId = req.userId;

  // update avatar with cloudinary
  const result = await UploadService.upload(req);

  if (result) req.body.avatar = result;

  const { name, avatar, bio } = req.body;
  const user = await userModel.findOneAndUpdate(
    { _id: userId },
    { name, avatar, bio },
    { new: true }
  );

  if (!user) throw new BadRequestError("User not found!");

  return user;
};

module.exports = {
  findByEmail,
  searchUser,
  getUsers,
  updateUser,
  getUserInfo,
  follow,
  unFollow,
  followingsUser,
};
