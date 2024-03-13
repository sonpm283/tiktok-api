"use strict";

const keyTokenModel = require("../models/keytoken.model");

const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true }; // upsert: true -> nếu không có thì tạo mới, nếu có thì update

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  // tìm kiếm user theo userId
  static findUserById = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
  };

  // xoá key theo id
  static removeKeyById = async (id) => {
    return keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) });
  };
}

module.exports = KeyTokenService;
