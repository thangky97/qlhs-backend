"use strict";
const InstructorsResourceAccess = require("../resourceAccess/InstructorsResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../InstructorsConstant");
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
      let instructorsData = req.payload;

      //create new user
      let addResult = await InstructorsResourceAccess.insert(instructorsData);
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

      let instructors = await InstructorsResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (instructors && instructors.length > 0) {
        let instructorsCount = await InstructorsResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: instructors, total: instructorsCount });
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
      let data = await InstructorsResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        delete filter.lang;
        delete filter.service_type;
        let count = await InstructorsResourceAccess.customCount(filter);
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
      let instructorsData = req.payload.data;
      let instructorsId = req.payload.id;

      let updateResult = await InstructorsResourceAccess.updateById(
        instructorsId,
        instructorsData
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
      const data = await InstructorsResourceAccess.customGetDetail(
        req.query.id
        // req.query.lang
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
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
      let category = await InstructorsResourceAccess.findById(
        req.query.id,
        "id"
      );
      if (category) {
        delete category.password;
        resolve(category);
      }
      reject("Not found category");
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
  getDetail,
};
