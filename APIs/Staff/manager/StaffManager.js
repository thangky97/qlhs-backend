"use strict";
const StaffResourceAccess = require("../resourceAccess/StaffResourceAccess");
const StaffFunctions = require("../StaffFunctions");
const TokenFunction = require("../../ApiUtils/token");
const Logger = require("../../../utils/logging");
const { STAFF_ERROR, STAFF_ROLE } = require("../StaffConstant");
const CommonFunctions = require("../../Common/CommonFunctions");

async function insert(req) {
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
      let staffData = req.payload;
      if (staffData.roleId && staffData.roleId === 1) {
        reject("can not insert staff");
        return;
      }
      //create new user
      let addResult = await StaffFunctions.createNewStaff(
        staffData,
        staffData.password
      );
      if (addResult === undefined) {
        reject("can not insert staff");
        return;
      } else {
        resolve(addResult);
      }
      return;
    } catch (e) {
      Logger.error(`${__filename} ${e}`);
      if (e === STAFF_ERROR.DUPLICATED_USER) {
        reject(STAFF_ERROR.DUPLICATED_USER);
      } else if (e === STAFF_ERROR.DUPLICATED_USER_EMAIL) {
        reject(STAFF_ERROR.DUPLICATED_USER_EMAIL);
      } else if (e === STAFF_ERROR.DUPLICATED_USER_PHONE) {
        reject(STAFF_ERROR.DUPLICATED_USER_PHONE);
      } else {
        reject("failed");
      }
    }
  });
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

      if (!filter) {
        filter = {};
      }

      let staffs = await StaffResourceAccess.customFind(filter, skip, limit, [
        order.key,
        order.value,
      ]);

      if (staffs && staffs.length > 0) {
        let staffsCount = await StaffResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: staffs, total: staffsCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
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
      let staffData = req.payload.data;
      let staffId = req.payload.id;
      let isValid = await StaffFunctions.verifyBeforeUpdate(staffId, staffData);
      if (isValid) {
        let updateResult = await StaffResourceAccess.updateById(
          staffId,
          staffData
        );
        if (updateResult) {
          resolve("success");
        }
      }
      reject("failed to update staff");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
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
      let staff = await StaffResourceAccess.findById(req.query.id, "id");
      if (staff) {
        delete staff.password;
        resolve(staff);
      }
      reject("Not found staff");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
  });
}

async function registerStaff(req) {
  return insert(req);
}

async function loginStaff(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userName = req.payload.username;
      let password = req.payload.password;

      //verify credential
      let foundStaff = await StaffFunctions.verifyCredentials(
        userName,
        password
      );
      if (foundStaff) {
        if (foundStaff.status !== 1) {
          reject("failed");
        }

        //create new login token
        let token = await TokenFunction.createToken(foundStaff);
        console.log(token);
        foundStaff.token = token;

        resolve(foundStaff);
        return;
      }

      reject("failed to login staff");
    } catch (e) {
      Logger.error(__filename, e);
      if (e === STAFF_ERROR.USERNAME_OR_PASSWORD_NOT_MATCH) {
        reject(STAFF_ERROR.USERNAME_OR_PASSWORD_NOT_MATCH);
      }
      reject("failed");
    }
    return;
  });
}

async function changePasswordStaff(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userName = req.currentUser.username;
      let password = req.payload.password;
      let newPassword = req.payload.newPassword;
      //verify credential
      let foundStaff = await StaffFunctions.verifyCredentials(
        userName,
        password
      );

      if (foundStaff) {
        let result = StaffFunctions.changeStaffPassword(
          foundStaff,
          newPassword
        );
        if (result) {
          resolve(result);
          return;
        }
      }
      reject("change user password failed");
    } catch (e) {
      Logger.error(__filename + e);
      reject("WRONG_PASSWORD");
    }
  });
}

async function resetPasswordStaff(req) {
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
      let id = req.payload.id;
      //verify credential
      let foundStaff = await StaffResourceAccess.findById(id, "id");

      if (foundStaff) {
        let result = StaffFunctions.changeStaffPassword(foundStaff, "123456");
        if (result) {
          resolve(result);
          return;
        }
      }
      reject("change user password failed");
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function adminChangePasswordStaff(req) {
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
      let newPassword = req.payload.newPassword;
      //verify credential
      let foundStaff = await StaffResourceAccess.find(
        { staffId: req.payload.id },
        0,
        1
      );

      if (foundStaff && foundStaff.length > 0) {
        foundStaff = foundStaff[0];
        let result = StaffFunctions.changeStaffPassword(
          foundStaff,
          newPassword
        );
        if (result) {
          resolve(result);
          return;
        }
      }
      reject("change user password failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function deleteStaffById(req) {
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
      let staffId = req.payload.id;

      let result = StaffResourceAccess.deleteById(staffId);
      if (result) {
        resolve(result);
        return;
      }
      reject("delete failed");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  registerStaff,
  loginStaff,
  changePasswordStaff,
  adminChangePasswordStaff,
  deleteStaffById,
  resetPasswordStaff,
};
