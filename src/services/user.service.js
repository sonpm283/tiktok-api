"use strict";

const userModel = require("../models/user.model");

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

module.exports = {
  findByEmail,
  searchUser,
};
