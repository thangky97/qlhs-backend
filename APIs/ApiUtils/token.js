"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppConfig = require("../../config/app");
const Logger = require("../../utils/logging");
const Jwt = require("@hapi/jwt");

function Token(user, tokenType, expires) {
  const userData = {
    id: user.id,
    roleId: user.roleId,
    tokenType,
  };
  return Jwt.token.generate(
    {
      aud: "urn:audience:tdsfsdfsdfsdfdest",
      iss: "urn:issuer:tesdfsdfsdfst",
      ...userData,
    },
    AppConfig.jwt.secret,
    {
      algorithm: "HS256",
      expiresIn: expires,
    }
  );
}

// function createToken(user, tokenType = "normalUser") {
//   console.log("user.roleId", user.roleId);
//   const userData = {
//     id: user.id,
//     roleId: user.roleId,
//     tokenType,
//   };
//   console.log("userDatass", userData);
//   return Jwt.token.generate(
//     {
//       aud: "urn:audience:tdsfsdfsdfsdfdest",
//       iss: "urn:issuer:tesdfsdfsdfst",
//       ...userData,
//     },
//     AppConfig.jwt.secret,
//     {
//       algorithm: "HS256",
//       expiresIn: AppConfig.jwt.expiresIn,
//     }
//   );
// }

async function createToken(user) {
  try {
    const expires = AppConfig.jwt.expiresIn;
    return await Token(user, "staffToken", expires);
  } catch (error) {
    console.log(error);
  }
}

async function createUserToken(user) {
  try {
    const expires = AppConfig.jwt.expiresIn;
    return await Token(user, "normalUser", expires);
  } catch (error) {
    console.log(error);
  }
}

async function createTokenDetail(payload) {
  console.log("payload", payload);
  try {
    return await Token(payload, "cloudToken", payload.expired_date);
  } catch (error) {
    console.log(error);
  }
}

async function createTokenNoDeline(user) {
  try {
    const expires = AppConfig.jwt.expiresNooDeadline;
    return await Token(user, "cloudTokenNoDeline", expires);
  } catch (error) {
    console.log(error);
  }
}

function decodeToken(token) {
  token = token.replace("Bearer ", "");
  var decoded = undefined;
  try {
    decoded = jwt.verify(token, AppConfig.jwt.secret);
    return decoded;
  } catch (err) {
    Logger.error("Token", err);
    return decoded;
  }
}

function hashPassword(password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    if (!err) {
      bcrypt.hash(password, salt, (err, hash) => {
        return cb(err, hash);
      });
    }
  });
}
module.exports = {
  Token,
  decodeToken,
  hashPassword,
  createToken,
  createTokenNoDeline,
  createTokenDetail,
  createUserToken,
};
