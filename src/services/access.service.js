"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { RoleUser } = require("../utils/constants");
const {
  BadRequestError,
  ForbiddenError,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./user.service");

class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    //check xem token nay da su dung chua
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );

    // neu co
    if (foundToken) {
      console.log("foundToken", foundToken);
      //decode token de lay thong tin user
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
      console.log("[1----]", { userId, email });
      // xoá tat ca token khỏi keyTokenStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened! Pls relogin");
    }

    // nếu refresh token chưa được sử dụng
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    console.log("holderToken", holderToken);
    if (!holderToken) throw new AuthFailureError("User not registered!");

    // verify refreshToken
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2]--", { userId, email });

    // check userId
    const foundUser = findByEmail({ email });
    if (!foundUser) throw new AuthFailureError("User not registered!");

    // tạo 1 cặp token mới
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    console.log("tokens", tokens);

    //update trực tiếp token mới từ holderToken vừa tìm kiếm được ở trên
    await holderToken.updateOne({
      $set: {
        //cập nhật lại refreshToken mới
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        // thêm refreshToken cũ vào mảng refreshTokensUsed
        // nếu bị hack thì có thể kiểm tra xem refreshToken nào đã được sử dụng
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    // remove keyToken in db
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static login = async ({ email, password, refeshToken = null }) => {
    //1, check email in db
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("Users not registered!");
    console.log("password", password, foundUser.password);

    //2, match password
    const math = await bcrypt.compare(password, foundUser.password);
    if (!math) throw new AuthFailureError("Authentication failed!");

    // 3, create privateKey and publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    //4, generate tokens
    const { _id: userId } = foundUser; // get _id from foundUser and rename to userId(descructuring)

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    // 4.1, save keyToken to db
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    // 5, get data return login
    return {
      metadata: {
        user: getInfoData({
          object: foundUser,
          fileds: ["_id", "name", "email"],
        }),
        tokens,
      },
    };
  };

  static signUp = async ({ name, email, password }) => {
    //STEP 1: check email exists
    const holderUser = await userModel.findOne({ email }).lean();
    if (holderUser) {
      throw new BadRequestError("Error: User already registered!");
    }

    //STEP 2: create new user
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleUser.USER],
    });

    //STEP 3: create accecs token and refresh token
    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("publicKeyString error");
      }

      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );

      console.log("Created Token Success", tokens);

      return {
        code: 201,
        metadata: {
          user: getInfoData({
            object: newUser,
            fileds: ["_id", "name", "email"],
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
