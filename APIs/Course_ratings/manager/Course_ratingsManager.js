"use strict";
const Course_ratingsResourceAccess = require("../resourceAccess/Course_ratingsResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../Course_ratingsConstant");
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
      let course_ratingsData = req.payload;
      //create new user
      let addResult = await Course_ratingsResourceAccess.insert(
        course_ratingsData
      );
      if (addResult === undefined) {
        reject("can not insert category");
        return;
      } else {
        resolve(addResult);
      }
      return;
    } catch (e) {
      Logger.error(`${__filename} ${e}`);
      reject("failed");
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

      let course_videos = await Course_filesResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (course_videos && course_videos.length > 0) {
        let course_videosCount = await Course_filesResourceAccess.count(
          filter,
          [order.key, order.value]
        );
        resolve({ data: course_videos, total: course_videosCount });
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
      let data = await Course_filesResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        delete filter.lang;
        delete filter.service_type;
        let count = await Course_filesResourceAccess.customCount(filter);
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
      let course_filesData = req.payload.data;
      let course_filestorsId = req.payload.id;

      let updateResult = await Course_filesResourceAccess.updateById(
        course_filestorsId,
        course_filesData
      );
      if (updateResult) {
        resolve("success");
      }

      reject("failed to update category");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
}
async function getDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Course_filesResourceAccess.customGetDetail(
        req.query.id
        // req.query.lang
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail Course_instructors error " + error);
      reject("failed");
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
      let course_instructors = await Course_filesResourceAccess.findById(
        req.query.id,
        "id"
      );
      if (course_instructors) {
        delete course_instructors.password;
        resolve(course_instructors);
      }
      reject("Not found course_instructors");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
  });
}
async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;

      let res = await Course_filesResourceAccess.deleteById(id);
      if (res) {
        resolve(res);
      } else {
        reject("failed");
      }
    } catch (error) {
      console.error(__filename, error);
      reject("failed");
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  getList,
  getDetail,
  deleteById,
};
