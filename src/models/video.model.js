"use strict";

const { model, Schema } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const DOCUMENT_NAME = "Video";
const COLLECTION_NAME = "Videos";

const videoSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
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

videoSchema.plugin(mongoosePaginate)

module.exports = model(DOCUMENT_NAME, videoSchema);
