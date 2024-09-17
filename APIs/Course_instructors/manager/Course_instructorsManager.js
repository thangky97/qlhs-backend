"use strict";
const Course_instructorsResourceAccess = require("../resourceAccess/Course_instructorsResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../Course_instructorsConstant");
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
      let course_instructorsData = req.payload;
      //create new user
      let addResult = await Course_instructorsResourceAccess.insert(
        course_instructorsData
      );
      console.log(addResult);
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

      let course_instructors =
        await Course_instructorsResourceAccess.customFind(
          filter,
          skip,
          limit,
          order
        );

      if (course_instructors && course_instructors.length > 0) {
        let course_instructorsCount =
          await Course_instructorsResourceAccess.count(filter, [
            order.key,
            order.value,
          ]);
        resolve({ data: course_instructors, total: course_instructorsCount });
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
      let data = await Course_instructorsResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        delete filter.lang;
        delete filter.service_type;
        let count = await Course_instructorsResourceAccess.customCount(filter);
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
      let course_instructorsData = req.payload.data;
      let course_instructorsId = req.payload.id;

      let updateResult = await Course_instructorsResourceAccess.updateById(
        course_instructorsId,
        course_instructorsData
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
      const data = await Course_instructorsResourceAccess.customGetDetail(
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
      let course_instructors = await Course_instructorsResourceAccess.findById(
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

      let res = await Course_instructorsResourceAccess.deleteById(id);
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
