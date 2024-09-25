"use strict";
const SemesterResourceAccess = require("../resourceAccess/SemesterResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../SemesterConstant");
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
      let semesterData = req.payload;

      let addResult = await SemesterResourceAccess.insert(semesterData);
      if (addResult === undefined) {
        reject("can not insert semester");
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

      let semesters = await SemesterResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (semesters && semesters.length > 0) {
        let semesterCount = await SemesterResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: semesters, total: semesterCount });
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
      let data = await SemesterResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await SemesterResourceAccess.customCount(filter);
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
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }

      let courrseId = req.payload.id;
      let semesterData = req.payload.data;

      let updateResult = await SemesterResourceAccess.updateById(
        courrseId,
        semesterData
      );

      if (updateResult) {
        delete updateResult.password;
        resolve(updateResult);
      }

      reject("failed to update semester");
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
      let semester = await SemesterResourceAccess.findById(req.query.id, "id");
      if (semester) {
        delete semester.password;
        resolve(semester);
      }
      reject("Not found semester");
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
