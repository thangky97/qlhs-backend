"use strict";
const Logger = require("../../../utils/logging");
const UserFunctions = require("../UserFunctions");
const { USER_ERROR } = require("../UserConstants");
const UserResource = require("../resourceAccess/userResouceAccess");
const { sendMail } = require("../../../services/utils");
const template = require("../../../config/email.template");
const config = require("../../../config");
const { Token } = require("../../ApiUtils/token");
const CommonFunctions = require("../../Common/CommonFunctions");
const { STAFF_ROLE } = require("../../Staff/StaffConstant");
const TokenFunction = require("../../ApiUtils/token");
const DB = require("../../../models");
const { error } = require("winston");

async function _registerUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      let insertResult = await UserFunctions.createNewUser(userData);

      if (insertResult) {
        const service = await DB.product.findAll({
          where: {
            status: 1,
            product_type: 3,
          },
        });
        for (let i = 0; i < service.length; i++) {
          let token = await TokenFunction.createTokenNoDeline(
            service[i],
            "serviceToken"
          );
          await DB.user_tokens.create({
            token,
            userId: insertResult.id,
            productId: service[i].id,
          });
        }
        resolve(insertResult);
      } else {
        reject("failed");
      }
      return;
    } catch (e) {
      Logger.error(__filename + e);
      if (e === USER_ERROR.DUPLICATED_USER) {
        reject(USER_ERROR.DUPLICATED_USER);
      } else if (e === USER_ERROR.DUPLICATED_USER_EMAIL) {
        reject(USER_ERROR.DUPLICATED_USER_EMAIL);
      } else if (e === USER_ERROR.DUPLICATED_USER_PHONE) {
        reject(USER_ERROR.DUPLICATED_USER_PHONE);
      } else if (e === USER_ERROR.REFER_USER_NOT_FOUND) {
        reject(USER_ERROR.REFER_USER_NOT_FOUND);
      } else {
        reject("failed");
      }
    }
  });
}

async function insertUsertoken(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const userToken = await DB.user_tokens.findOne({
        where: {
          userId: req.payload.usersId,
          productId: req.payload.productId,
        },
      });
      if (!userToken) {
        resolve(userToken);
      } else {
        reject("TOKEN_ALREADY_EXITS");
      }
      console.log("userToken", userToken);
      let token = await TokenFunction.createTokenNoDeline(
        req.payload,
        "serviceToken"
      );
      const result = await DB.user_tokens.create({
        token,
        userId: req.payload.usersId,
        productId: req.payload.productId,
      });

      resolve(result);
    } catch (e) {
      console.log(e);
    }
  });
}

async function updateTokenuser(req) {
  console.log("reqsss", req.payload.data.usersId);
  return new Promise(async (resolve, reject) => {
    try {
      let token = await TokenFunction.createTokenNoDeline(
        req.payload.data,
        "serviceToken"
      );
      const result = await UserResource.updateUserToken(req.payload.id, {
        token,
        userId: req.payload.data.usersId,
        productId: req.payload.data.productId,
      });
      resolve(result);
      return;
    } catch (e) {
      console.log(e);
    }
  });
}

async function checkExistingEmail(req) {
  let _existedUsers = await UserResource.find({ email: req.payload.email });
  let isUsed;
  if (_existedUsers && _existedUsers.length > 0) {
    isUsed = true;
  } else {
    isUsed = false;
  }
  return {
    isUsed: isUsed,
  };
}

async function checkExistingPhone(req) {
  let _existedUsers = await UserResource.find({ phone: req.payload.phone });
  let isUsed;
  if (_existedUsers && _existedUsers.length > 0) {
    isUsed = true;
  } else {
    isUsed = false;
  }
  return {
    isUsed: isUsed,
  };
}

async function checkExistingUsername(req) {
  let _existedUsers = await UserResource.find({
    username: req.payload.username,
  });
  let isUsed;
  if (_existedUsers && _existedUsers.length > 0) {
    isUsed = true;
  } else {
    isUsed = false;
  }
  return {
    isUsed: isUsed,
  };
}
async function checkExistingUsername(req) {
  let _existedUsers = await UserResource.find({
    username: req.payload.username,
  });
  let isUsed;
  if (_existedUsers && _existedUsers.length > 0) {
    isUsed = true;
  } else {
    isUsed = false;
  }
  return {
    isUsed: isUsed,
  };
}

async function getUsertoken(req) {
  console.log("reqs", req);
  try {
    const userToken = await DB.user_tokens.findAll({
      where: {
        userId: req.currentUser.id,
      },
    });

    return userToken;
  } catch (error) {
    throw error;
  }
}

async function insert(req) {
  if (
    (await CommonFunctions.verifyRole(
      req.currentUser,
      STAFF_ROLE.MANAGE_STAFF
    )) == false
  ) {
    reject("NOT_ALLOWED");
    return;
  }
  let userData = req.payload;
  return await _registerUser(userData);
}

async function register(req) {
  let userData = req.payload;
  return await _registerUser(userData);
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let users = await UserResource.customFind(filter, skip, limit, [
        order.key,
        order.value,
      ]);

      if (users && users.length > 0) {
        let usersCount = await UserResource.customCount(filter);
        resolve({ data: users, total: usersCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function findUserToken(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let first_name = req.payload.first_name;
      let last_name = req.payload.last_name;
      let order = req.payload.order;
      let users = await UserResource.findUserToken(
        filter,
        first_name,
        last_name,
        skip,
        limit,
        order
      );

      if (users && users.length > 0) {
        let usersCount = await UserResource.customUserTokenCount(filter);
        resolve({ data: users, total: usersCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function findTokenbyid(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await DB.user_tokens.findOne({
        where: {
          id: req.query.id,
        },
      });
      console.log("users", user);
      if (user) {
        resolve({ data: user });
      } else {
        resolve({ data: {} });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function removeUserToken(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await DB.user_tokens.destroy({
        where: {
          id: req.query.id,
        },
      });
      if (user) {
        resolve({ data: user });
      } else {
        resolve({ data: {} });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function removeTokenDetail(req) {
  try {
    const id = req.query.id;

    const user = await DB.userTokenDetails.destroy({
      where: {
        id,
      },
    });

    if (user) {
      return { data: user };
    } else {
      return { data: {} };
    }
  } catch (e) {
    Logger.error(__filename, e);
    throw new Error("failed");
  }
}

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let id = req.query.id;
      let user = await UserResource.findById(id, "id");
      if (user) {
        resolve({ data: user });
      } else {
        resolve({ data: {} });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function tokenDetailById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.query.id;
      let user = await DB.userTokenDetails.findOne({
        where: {
          id,
        },
      });
      if (user) {
        resolve({ data: user });
      } else {
        resolve({ data: {} });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function _login(username, password) {
  //verify credential
  let foundUser = await UserFunctions.verifyUserCredentials(username, password);
  if (foundUser) {
    if (foundUser.length > 0) {
      foundUser = foundUser[0];
    }
    if (foundUser.status !== 1) {
      throw USER_ERROR.USER_LOCKED;
    }

    return foundUser;
  } else {
    return undefined;
  }
}

async function _loginSocial(
  username,
  password,
  firstName,
  lastName,
  email,
  avatar
) {
  //verify credential
  let foundUser = await UserResource.find({
    username: email,
  });
  console.log("password", password);
  //if user is not found
  if (foundUser === undefined || foundUser.length < 1) {
    let newUserData = {
      username: email,
      password: email,
      email: email,
      first_name: firstName,
      last_name: lastName,
      avatar: avatar,
    };
    let registerResult = await UserFunctions.createNewUser(newUserData);
    console.log("registerResult", registerResult);
    if (!registerResult) {
      return undefined;
    }

    foundUser = await UserFunctions.verifyUserCredentials(email, email);
    console.log("foundUser", foundUser);
  } else {
    foundUser = foundUser[0];
    foundUser = await UserFunctions.retrieveUserDetail(foundUser.id);
  }

  if (foundUser.active === 0) {
    return undefined;
  }
  return foundUser;
}

async function loginUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let username = req.payload.username;
      let password = req.payload.password;

      let foundUser = await _login(username, password);
      if (foundUser) {
        resolve(foundUser);
      } else {
        reject(USER_ERROR.WRONG_PASSWORD);
      }
    } catch (e) {
      Logger.error(__filename, e);
      if (e === USER_ERROR.USER_LOCKED) {
        reject(USER_ERROR.USER_LOCKED);
      } else {
        reject("failed", e);
      }
    }
  });
}

async function loginGoogle(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        req.payload.google_id &&
        req.payload.google_id !== "" &&
        req.payload.google_id !== null
      ) {
        let username = "GOOGLE_" + req.payload.google_id;
        let password = req.payload.google_id;
        let avatar = req.payload.google_avatar;
        let email = req.payload.google_email;
        let firstName = req.payload.google_first_name;
        let lastName = req.payload.google_last_name;
        let loginResult = await _loginSocial(
          username,
          password,
          firstName,
          lastName,
          email,
          avatar
        );
        if (loginResult) {
          if (loginResult.length > 0) {
            loginResult = loginResult[0];
          }
          resolve(loginResult);
        } else {
          reject("failed");
        }
      } else {
        reject("failed");
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
}

async function userUpdateInfo(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.currentUser;
      let userNewData = req.payload;
      let isValid = await UserFunctions.verifyBeforeUpdate(
        userData.id,
        userNewData
      );
      if (isValid) {
        if (userNewData.password) {
          userNewData.password = UserFunctions.hashPassword(
            userNewData.password
          );
        }
        let updateResult = await UserResource.updateById(
          userData.id,
          userNewData
        );
        if (updateResult) {
          resolve(updateResult.dataValues);
          await UserFunctions.syncData(userData.id);
        }
      }
      Logger.error("userUpdateInfo failed to update user");
      reject("failed to update user");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
}

async function userUpdatePassword(req) {
  return new Promise(async (resolve, reject) => {
    if (
      (await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      )) == false
    ) {
      reject("NOT_ALLOWED");
      return;
    }
    try {
      let userNewData = req.payload;
      let isValid = await UserFunctions.verifyBeforeUpdate(
        userNewData.id,
        userNewData
      );
      if (isValid) {
        if (userNewData.password) {
          userNewData.password = UserFunctions.hashPassword(
            userNewData.password
          );
        }
        let updateResult = await UserResource.updateById(
          userNewData.id,
          userNewData
        );
        if (updateResult) {
          resolve(updateResult.dataValues);
          await UserFunctions.syncData(userNewData.id);
        }
      }
      Logger.error("userUpdateInfo failed to update user");
      reject("failed to update user");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
}

function _cleanData(data) {
  let keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    if ((data[keys[i]] === "" || data[keys[i]] === 0) && keys[i] !== "status") {
      data[keys[i]] = null;
    }
  }
  return data;
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let userData = req.payload.data;
      let id = req.payload.id;
      let isValid = await UserFunctions.verifyBeforeUpdate(id, userData);
      if (isValid) {
        userData = _cleanData(userData);
        let updateResult = await UserFunctions.updateUser(id, userData);
        if (updateResult) {
          resolve(updateResult.dataValues);
          await UserFunctions.syncData(id);
        }
      }
      reject("failed to update user");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
}

async function updateTokendetail(req) {
  try {
    let userData = req.payload.data;
    let id = req.payload.id;

    let updateResult = await DB.userTokenDetails.findOne({
      where: {
        id,
      },
    });

    const result = updateResult ? await updateResult.update(userData) : null;

    if (result) {
      return result;
    } else {
      throw new Error("failed");
    }
  } catch (e) {
    Logger.error(__filename + e);
    throw e;
  }
}
async function updateTokenDetailUsageCount(req) {
  try {
    let id = req.payload.id;

    let updateResult = await DB.userTokenDetails.findOne({
      where: {
        id,
      },
    });

    const usageCount = 1 + Number(updateResult?.usageCount || 0);

    const result = updateResult
      ? await updateResult.update({ usageCount })
      : null;

    if (result) {
      return result;
    } else {
      throw new Error("failed");
    }
  } catch (e) {
    Logger.error(__filename + e);
    throw e;
  }
}
async function forgotPassword(req) {
  return new Promise(async (resolve, reject) => {
    try {
      var user = await UserResource.find({ email: req.payload.email });
      if (user && user.length > 0) {
        const token = await Token(user[0]);
        var subject = template.forgot_password.subject;
        var html = template.forgot_password.html;
        const res = await sendMail([req.payload.email], {
          subject: subject,
          html: html.replace(
            "{{href}}",
            config.COMMON.url_forgot_password + token
          ),
        });
        if (res) {
          resolve("ok");
        } else {
          reject("failed");
        }
      } else {
        reject(USER_ERROR.USER_NOT_FOUND);
      }
    } catch (error) {
      Logger.error("forgot_pass_error " + error);
      reject(error);
    }
  });
}

async function changePassword(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = req.currentUser;
      let isValid = await UserFunctions.verifyBeforeChangePassword(
        user.id,
        req.payload.old_password,
        req.payload.new_password
      );
      if (isValid) {
        resolve(isValid);
      } else {
        reject("failed");
      }
    } catch (error) {
      Logger.error(__filename + error);
      reject(error);
    }
  });
}

async function getDetailById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await UserResource.findById(req.currentUser.id, "id");
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

module.exports = {
  insert,
  find,
  loginUser,
  checkExistingEmail,
  checkExistingPhone,
  checkExistingUsername,
  loginGoogle,
  userUpdateInfo,
  forgotPassword,
  updateById,
  findById,
  changePassword,
  getDetailById,
  register,
  userUpdatePassword,
  getUsertoken,
  insertUsertoken,
  updateTokenuser,
  findTokenbyid,
  findUserToken,
  removeUserToken,
  updateTokendetail,
  removeTokenDetail,
  tokenDetailById,
  updateTokenDetailUsageCount,
};
