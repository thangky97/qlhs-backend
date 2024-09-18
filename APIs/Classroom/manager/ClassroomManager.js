"use strict";
const ClassroomResourceAccess = require("../resourceAccess/ClassroomResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../ClassroomConstant");
const CommonFunctions = require("../../Common/CommonFunctions");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF,
          STAFF_ROLE.MANAGE_SYSTEM,
          STAFF_ROLE.MANAGE_USER
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let classroomData = req.payload;

      //create new user
      let addResult = await ClassroomResourceAccess.insert(classroomData);
      if (addResult === undefined) {
        reject("can not insert classroom");
        return;
      } else {
        resolve(addResult);
      }
      return;
    } catch (e) {
      Logger.error(`${__filename} ${e}`);
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF,
          STAFF_ROLE.MANAGE_SYSTEM,
          STAFF_ROLE.MANAGE_USER
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

      let classroom = await ClassroomResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (classroom && classroom.length > 0) {
        let classroomCount = await ClassroomResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: classroom, total: classroomCount });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function getList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let searchText = filter.name;
      delete filter.name;
      let data = await ClassroomResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await ClassroomResourceAccess.customCount(filter);
        resolve({ data: data, total: count });
      } else {
        resolve({ data: [], total: 0 });
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
          STAFF_ROLE.MANAGE_STAFF,
          STAFF_ROLE.MANAGE_SYSTEM,
          STAFF_ROLE.MANAGE_USER
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }

      let courrseId = req.payload.id;
      let classroomData = req.payload.data;

      let updateResult = await ClassroomResourceAccess.updateById(
        courrseId,
        classroomData
      );

      if (updateResult) {
        delete updateResult.password;
        resolve(updateResult);
      }

      reject("failed to update classroom");
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
          STAFF_ROLE.MANAGE_STAFF,
          STAFF_ROLE.MANAGE_SYSTEM,
          STAFF_ROLE.MANAGE_USER
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let classroom = await ClassroomResourceAccess.findById(
        req.query.id,
        "id"
      );
      if (classroom) {
        delete classroom.password;
        resolve(classroom);
      }
      reject("Not found classroom");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  getList,
};
