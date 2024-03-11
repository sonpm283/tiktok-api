"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "CommentReaction";
const COLLECTION_NAME = "CommentReactions";

const commentReactionComment = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    comment_id: { type: Schema.Types.ObjectId, required: true, ref: "Comment" },
    reaction_type: { type: String, required: true },
  },
  {
    timestamps,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, commentReactionComment);