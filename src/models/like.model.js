"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Like";
const COLLECTION_NAME = "Likes";

const likeSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, require: true, ref: "User" },
    video_id: { type: Schema.Types, ObjectId, require: true, ref: "Video" },
  },
  {
    timestamps,
    colection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, likeSchema);
