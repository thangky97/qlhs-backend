"use strict";
const TimetableResourceAccess = require("../resourceAccess/TimetableResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../TimetableConstant");
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
      let timetableData = req.payload;

      let addResult = await TimetableResourceAccess.insert(timetableData);
      if (addResult === undefined) {
        reject("can not insert timetable");
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

      let timetables = await TimetableResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (timetables && timetables.length > 0) {
        let timetableCount = await TimetableResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: timetables, total: timetableCount });
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
      let data = await TimetableResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await TimetableResourceAccess.customCount(filter);
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

      let timetableId = req.payload.id;
      let timetableData = req.payload.data;

      let updateResult = await TimetableResourceAccess.updateById(
        timetableId,
        timetableData
      );

      if (updateResult) {
        delete updateResult.password;
        resolve(updateResult);
      }

      reject("failed to update timetable");
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
      let timetable = await TimetableResourceAccess.findById(
        req.query.id,
        "id"
      );
      if (timetable) {
        delete timetable.password;
        resolve(timetable);
      }
      reject("Not found timetable");
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
