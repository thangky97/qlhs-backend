"use strict";
const CourseResourceAccess = require("../resourceAccess/CourseResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../CourseConstant");
const CommonFunctions = require("../../Common/CommonFunctions");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const isManageStaff = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      );
      const isManageSystem = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_SYSTEM
      );

      const isManageUser = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_USER
      );

      if (!isManageStaff && !isManageSystem && !isManageUser) {
        reject("NOT_ALLOWED");
        return;
      }
      let courseData = req.payload;

      //create new user
      let addResult = await CourseResourceAccess.insert(courseData);
      if (addResult === undefined) {
        reject("can not insert course");
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
      const isManageStaff = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      );
      const isManageSystem = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_SYSTEM
      );

      const isManageUser = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_USER
      );

      if (!isManageStaff && !isManageSystem && !isManageUser) {
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

      let courses = await CourseResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (courses && courses.length > 0) {
        let CourseCount = await CourseResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: courses, total: CourseCount });
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
      let data = await CourseResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await CourseResourceAccess.customCount(filter);
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
      const isManageStaff = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      );
      const isManageSystem = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_SYSTEM
      );

      const isManageUser = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_USER
      );

      if (!isManageStaff && !isManageSystem && !isManageUser) {
        reject("NOT_ALLOWED");
        return;
      }

      let courrseId = req.payload.id;
      let courseData = req.payload.data;

      let updateResult = await CourseResourceAccess.updateById(
        courrseId,
        courseData
      );

      if (updateResult) {
        delete updateResult.password;
        resolve(updateResult);
      }

      reject("failed to update course");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
}
async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const isManageStaff = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      );
      const isManageSystem = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_SYSTEM
      );

      const isManageUser = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_USER
      );

      if (!isManageStaff && !isManageSystem && !isManageUser) {
        reject("NOT_ALLOWED");
        return;
      }
      let course = await CourseResourceAccess.findById(req.query.id, "id");
      if (course) {
        delete course.password;
        resolve(course);
      }
      reject("Not found course");
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
