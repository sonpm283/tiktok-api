"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Commnents";

const commentSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    video_id: { type: Schema.Types.ObjectId, required: true },
    contents: { type: String, required: true },
    media_url: { type: String },
    comment_reaction_count: { type: Number, default: 0 },
  },
  {
    timestamps,
    collection: COLLECTION_NAME,
  }
);

commentSchema.index({ user_id: 1, video_id: 1 });

module.exports = model(DOCUMENT_NAME, commentSchema);
