"use strict";

const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

// Declare the Schema of the Mongo model
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    nickname: {
      type: String,
      unique: true,
      trim: true,
    },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    tick: { type: Boolean, default: false },
    followers_count: { type: Number, default: 0 },
    followings_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    social_network: [{ name: String, url: String }],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
