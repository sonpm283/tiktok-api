"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Follow";
const COLLECTION_NAME = "Follows";

const followSchema = new Schema(
  {
    follow_id: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // As A
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },// As B => B is following A
  },
  {
    timestamps,
    collection: COLLECTION_NAME,
  }
);

followSchema.index({ follow_id: 1, user_id: 1 });

module.exports = model(DOCUMENT_NAME, followSchema);
