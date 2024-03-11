"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Video";
const COLLECTION_NAME = "Videos";

const videoSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, requireed: true },
    media_url: { type: String, required: true },
    like_count: { type: Number, default: 0 },
    view_count: { type: Number, default: 0 },
    category_id: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
      },
    ],
    commnent_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, videoSchema);
