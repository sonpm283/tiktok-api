"use strict";

const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Video";
const COLLECTION_NAME = "Videos";

const videoSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    media_url: { type: String, required: true },
    likes: [{ type: Types.ObjectId, ref: "User" }],
    view_count: { type: Number, default: 0 },
    category_id: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Category",
        },
      },
    ],
    commnents: [{ type: Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, videoSchema);
