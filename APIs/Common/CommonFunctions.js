"use strict";
const token = require("../ApiUtils/token");
const UserResource = require("../User/resourceAccess/userResouceAccess");
const StaffResource = require("../Staff/resourceAccess/StaffResourceAccess");

const DB = require("../../models");

async function verifyToken(request) {
  return new Promise(async function (resolve) {
    //if there is no token or empty token
    if (
      !(request.headers.authorization && request.headers.authorization !== "")
    ) {
      request.rejectByInvalidToken = true;
      resolve();
      return;
    }

    let result = token.decodeToken(request.headers.authorization);

    //invalid token
    if (result === undefined) {
      request.rejectByInvalidToken = true;
      resolve();
      return;
    }

    //recheck again with realtime DB
    if (result.id && result.tokenType === "staffToken") {
      let currentUser = await StaffResource.find({ id: result.id });
      if (
        currentUser &&
        currentUser.length > 0 &&
        currentUser[0].status === 1
      ) {
        //append current user to request
        request.currentUser = currentUser[0];
        resolve("ok");
        return;
      }
    } else if (result.id) {
      let currentUser = await UserResource.find({ id: result.id });
      if (
        currentUser &&
        currentUser.length > 0 &&
        currentUser[0].status === 1
      ) {
        //append current user to request
        request.currentUser = currentUser[0];
        resolve("ok");
        return;
      }
    }
    request.rejectByInvalidToken = true;
    resolve();
    return;
  }).then(function () {
    return "pre-handler done";
  });
}
async function verifyStaffToken(request) {
  return new Promise(async function (resolve) {
    //if there is no token or empty token
    if (
      !(request.headers.authorization && request.headers.authorization !== "")
    ) {
      request.rejectByInvalidToken = true;
      resolve();
      return;
    }

    let result = token.decodeToken(request.headers.authorization);
    console.log(result);
    //invalid token
    if (result === undefined) {
      request.rejectByInvalidToken = true;
      resolve();
      return;
    }

    //recheck again with realtime DB
    if (result.id && result.tokenType === "staffToken") {
      let currentUser = await StaffResource.find({ id: result.id });
      if (
        currentUser &&
        currentUser.length > 0 &&
        currentUser[0].status === 1
      ) {
        //append current user to request
        request.currentUser = currentUser[0];
        resolve("ok");
        return;
      }
    }
    request.rejectByInvalidToken = true;
    resolve();
    return;
  }).then(function () {
    return "pre-handler done";
  });
}

async function verifyTokenOrAllowEmpty(request) {
  return new Promise(async function (resolve) {
    request.rejectByInvalidToken = false;
    if (
      request.headers.authorization !== undefined &&
      request.headers.authorization.trim() !== ""
    ) {
      let result = token.decodeToken(request.headers.authorization);

      //append current user to request
      if (result?.id) {
        let currentUser = await UserResource.findById(result.id, "id");
        if (currentUser && currentUser.status === 1) {
          //append current user to request
          request.currentUser = currentUser[0];
          request.currentUser = currentUser;
          resolve("ok");
          return;
        }
      }
    }
    resolve("ok");
    return;
  }).then(function () {
    return "pre-handler done";
  });
}

async function verifyMonitoringToken(request) {
  return new Promise(async (resolve, reject) => {
    // if (!(request.headers.monitoring_authorization && request.headers.monitoring_authorization !== "")) {
    //   request.rejectProductExpired = true;
    //   resolve();
    //   return;
    // }

    // let result = token.decodeToken(request.headers.monitoring_authorization);
    // //invalid token
    // if (result === undefined) {
    //   request.rejectProductExpired = true;
    //   resolve();
    //   return;
    // }

    let currentUser = request.currentUser;
    // find user in db q traffic
    let client = await DB.m_user.findOne({
      where: {
        UserMappingId: currentUser.id,
      },
      raw: true,
    });
    if (!client) {
      request.rejectProductExpired = true;
      resolve();
      return;
    }
    // check token is not expired
    // let existToken = await DB.m_token.findOne({
    //   where: {
    //     User_ID: client.User_ID,
    //     Token: request.headers.monitoring_authorization.replace('Bearer ', ''),
    //     Token_Expired: {
    //       [Op.gte]: new Date().toISOString()
    //     }
    //   },
    //   raw: true
    // });

    // if (!existToken) {
    //   request.rejectProductExpired = true;
    //   resolve();
    //   return;
    // } else {
    // }
    request.currentMonitoring = {
      User_ID: client.User_ID,
    };
    resolve("ok");
    return;
  }).then(() => {
    return "pre-handler done";
  });
}

async function verifyRole(curretnStaff, roleName) {
  if (curretnStaff.role && curretnStaff.role.includes(roleName)) {
    return true;
  }
  return false;
}

module.exports = {
  verifyToken,
  verifyStaffToken,
  verifyTokenOrAllowEmpty,
  verifyMonitoringToken,
  verifyRole,
};
