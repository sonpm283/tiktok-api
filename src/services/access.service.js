"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { RoleUser } = require("../utils/constants");
const { BadRequestError } = require("../core/error.response");
const { findByEmail } = require("./user.service");

class AccessService {
  /*
      1, check email in db
      2, match password
      3, create privateKey and publicKey
      4, generate tokens
      5, get data return login
  */

  static login = async ({ email, password, refeshToken = null }) => {
    //1, check email in db
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("Users not registered!");
    console.log('password', password, foundUser.password);
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
