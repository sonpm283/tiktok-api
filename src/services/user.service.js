"use strict";

const userModel = require("../models/user.model");
const cloudinary = require("../configs/cloudinary");
const { BadRequestError } = require("../core/error.response");

// Get user list
const getUsers = async () => {
  const users = await userModel
    .find()
    .limit(10)
    .select("name email nickname tick")
    .lean();

  if (!users) BadRequestError("No users found");

  return users;
};

const getUserInfo = async (req) => {
  const userId = req.params.id;

  const user = await userModel
    .findById(userId)
    .select("name avatar nickname tick followers_count followings_count")
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

// update user
const updateUser = async (req) => {
  const userId = req.params.user_id;
  const { name, avatar } = req.body;

  //update avatar with cloudinary
  if (userId) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "image",
    });
    req.body.avatar = result.url;
  }

  const user = await userModel.findOneAndUpdate(
    { userId },
    { name, avatar },
    { new: true }
  );

  if (!user) throw new BadRequestError("User not found!");

  return user;
};

module.exports = {
  findByEmail,
  searchUser,
  updateUser,
  getUsers,
  getUserInfo,
};
