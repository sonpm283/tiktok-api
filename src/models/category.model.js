"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

const categorySchema = new Schema(
  {
    category_name: { type: String, require: true },
  },
  {
    timestamps,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, categorySchema);
