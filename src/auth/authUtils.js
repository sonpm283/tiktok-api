"use strict";

//install jwt package
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/anyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findUserById } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // acccess token
    // tạo access token bằng JWT.sign() với publicKey,
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    // tạo refresh token bằng JWT.sign() với privateKey,
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // verify acccessToken
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("error verify:", err);
      } else {
        console.log("decode verify: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  //1, check userId in req.headers
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2, check user trong db
  const keyStore = await findUserById(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  // 3, get Accestoken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  // 4, verify accessToken
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    const { userId } = decodeUser;
    if (userId !== userId) throw new AuthFailureError("Invalid UserId");
    req.userId = userId;
    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
