"use strict";

const AppUsersResourceAccess = require("./resourceAccess/userResouceAccess");
const crypto = require("crypto");
const { USER_ERROR } = require("./UserConstants");
const Logger = require("../../utils/logging");
const TokenFunction = require("../ApiUtils/token");
const QTrafficCommonResource = require("../Common/resourceAccess/QTrafficCommonResourceAccess");
const DB = require("../../models");

async function createNewUser(userData) {
  return new Promise(async (resolve, reject) => {
    //check existed username
    let _existedUsers = await AppUsersResourceAccess.find({
      username: userData.username,
    });
    if (_existedUsers && _existedUsers.length > 0) {
      reject(USER_ERROR.DUPLICATED_USER);
      return;
    }

    //check existed email
    if (userData.email) {
      _existedUsers = await AppUsersResourceAccess.find({
        email: userData.email,
      });
      if (_existedUsers && _existedUsers.length > 0) {
        reject(USER_ERROR.DUPLICATED_USER_EMAIL);
        return;
      }
    }

    //check existed phoneNumber
    if (userData.phone && userData.phone.trim().length > 0) {
      _existedUsers = await AppUsersResourceAccess.find({
        phone: userData.phone,
      });
      if (_existedUsers && _existedUsers.length > 0) {
        reject(USER_ERROR.DUPLICATED_USER_PHONE);
        return;
      }
    }
    //hash password
    userData.password = hashPassword(userData.password);
    //create new user
    let addResult = await AppUsersResourceAccess.insert(userData);
    if (addResult && addResult.dataValues && addResult.dataValues.id) {
      let userDetail = await retrieveUserDetail(addResult.dataValues.id);
      resolve(userDetail);
    } else {
      Logger.info("can not insert user " + JSON.stringify(userData));
      reject(USER_ERROR.DUPLICATED_USER);
    }
    return;
  });
}

async function retrieveUserDetail(appUserId) {
  //get user detial
  let user = await AppUsersResourceAccess.find({ id: appUserId });
  if (user && user.length > 0) {
    user = user[0];
    delete user.password;
    //create new login token
    let token = await TokenFunction.createUserToken(user);
    console.log("tokenss", token);
    user.token = token;

    return user;
  }

  return undefined;
}

function hashPassword(password) {
  const hashedPassword = crypto
    .createHmac("sha256", "ThisIsSecretKey")
    .update(password)
    .digest("hex");
  return hashedPassword;
}

async function verifyUserCredentials(username, password) {
  let hashedPassword = hashPassword(password);
  // Find an entry from the database that
  // matches either the email or username
  let verifyResult = await AppUsersResourceAccess.find({
    username: username,
    password: hashedPassword,
  });

  if (verifyResult && verifyResult.length > 0) {
    let foundUser = verifyResult[0];
    foundUser = await retrieveUserDetail(foundUser.id);

    return foundUser;
  } else {
    return undefined;
  }
}

async function verifyBeforeUpdate(id, userData) {
  return new Promise(async (resolve, reject) => {
    //check existed email
    let _existedUsers;
    if (userData.email && userData.email.trim().length > 0) {
      _existedUsers = await AppUsersResourceAccess.find({
        email: userData.email,
      });
      if (_existedUsers && _existedUsers.length > 0) {
        if (_existedUsers[0].id !== id) {
          reject(USER_ERROR.DUPLICATED_USER_EMAIL);
          return;
        }
      }
    }

    //check existed phoneNumber
    if (userData.phone && userData.phone.trim().length > 0) {
      _existedUsers = await AppUsersResourceAccess.find({
        phone: userData.phone,
      });
      if (_existedUsers && _existedUsers.length > 0) {
        if (_existedUsers[0].id !== id) {
          reject(USER_ERROR.DUPLICATED_USER_PHONE);
          return;
        }
      }
    }
    resolve("ok");
    return true;
  });
}

async function verifyBeforeChangePassword(id, password, newPassword) {
  return new Promise(async (resolve, reject) => {
    let _existedUsers = await AppUsersResourceAccess.find({
      id: id,
      password: hashPassword(password),
    });
    if (_existedUsers && _existedUsers.length > 0) {
      const data = await AppUsersResourceAccess.updateById(id, {
        password: hashPassword(newPassword),
      });

      resolve(data);
      return true;
    } else {
      reject(USER_ERROR.WRONG_PASSWORD);
      return false;
    }
  });
}

async function updateUser(id, userData) {
  return new Promise(async (resolve, reject) => {
    //check existed username

    console.log("userData.password", userData.password);
    //hash password
    userData.password = hashPassword(userData.password);
    // if (userData.avatar === null || userData.avatar === undefined || userData.avatar === "") {
    //   userData.avatar = `https://${process.env.HOST_NAME}/uploads/avatar.png`;
    // }

    //create new user
    let addResult = await AppUsersResourceAccess.updateById(id, userData);
    if (addResult && addResult.dataValues) {
      resolve(addResult);
    } else {
      Logger.info("can not update user " + JSON.stringify(userData));
      reject(USER_ERROR.DUPLICATED_USER);
    }
    return;
  });
}

async function syncData(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      // retrieve user data
      let userData = await AppUsersResourceAccess.findById(userId, "id");
      if (!userData) {
        reject(USER_ERROR.USER_NOT_FOUND);
        return;
      }

      // check existing user in QTraffic
      let existingUser = await DB.m_user.findOne({
        where: {
          UserMappingId: userData.id,
          Password: userData.password,
        },
      });
      if (existingUser) {
        resolve(existingUser.User_ID);
      } else {
        let resInert = await QTrafficCommonResource.insert("m_user", {
          User_Name: userData.username,
          Password: userData.password,
          Email: userData.email || `${userData.username}@qtraffic.com`,
          UserMappingId: userData.id,
        });
        if (resInert && resInert.dataValues && resInert.dataValues.User_ID) {
          console.log("sync data", resInert.dataValues);
          resolve(resInert.dataValues.User_ID);
        }
        {
          reject("failed");
        }
      }
    } catch (error) {
      Logger.error("error sync user " + error);
      reject(error);
    }
  });
}

module.exports = {
  createNewUser,
  hashPassword,
  verifyUserCredentials,
  retrieveUserDetail,
  verifyBeforeUpdate,
  verifyBeforeChangePassword,
  syncData,
  updateUser,
};
