"use strict";
const Logger = require("../../../../utils/logging");
const SettingResourceAccess = require("../resourceAccess/SettingResourceAccess");
const CommonFunctions = require("../../../Common/CommonFunctions");
const { STAFF_ROLE } = require("../../../Staff/StaffConstant");

async function findAll() {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await SettingResourceAccess.findAll({});
      if (data && data.length > 0) {
        resolve(data[0]);
      } else {
        resolve({});
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_SYSTEM
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let addSetting = req.payload;
      let data = await SettingResourceAccess.findAll();
      if (data && data.length > 0) {
        data = data[0];
        data = await SettingResourceAccess.updateById(data.id, addSetting);
      } else {
        data = await SettingResourceAccess.insert(addSetting);
      }
      if (data) {
        resolve(data);
      } else {
        resolve("failed");
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_SYSTEM
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let id = req.payload.id;
      let data = await SettingResourceAccess.deleteById(id);
      if (data) {
        resolve("ok");
      } else {
        reject("delete failed");
      }
    } catch (e) {
      Logger.error(__filename + e);
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
          STAFF_ROLE.MANAGE_SYSTEM
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let updateData = req.payload.data;
      let data = await SettingResourceAccess.findAll();
      if (data && data.length > 0) {
        data = data[0];
        data = await SettingResourceAccess.updateById(data.id, updateData);
      } else {
        data = await SettingResourceAccess.insert(updateData);
      }
      if (data) {
        resolve("success");
      } else {
        reject("failed to update Setting");
      }
      return;
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

module.exports = {
  findAll,
  insert,
  deleteById,
  updateById,
};
