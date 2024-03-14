"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Reaction";
const COLLECTION_NAME = "Reactions";

const reactionSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, require: true, ref: "User" },
    video_id: { type: Schema.Types, ObjectId, require: true, ref: "Video" },
    reaction_type: { type: String, require: true },
  },
  {
    timestamps,
    colection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, reactionSchema);
