"use strict";
const NotificationResourceAccess = require("../resourceAccess/NotificationResourceAccess");
const Logger = require("../../../utils/logging");
const { category_ERROR, STAFF_ROLE } = require("../NotificationConstant");
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
      let categoryData = req.payload;

      //create new user
      let addResult = await NotificationResourceAccess.insert(categoryData);
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

      let categorys = await NotificationResourceAccess.customFind(
        filter,
        skip,
        limit,
        [order.key, order.value]
      );

      if (categorys && categorys.length > 0) {
        let categorysCount = await NotificationResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: categorys, total: categorysCount });
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
      let data = await NotificationResourceAccess.customFind(
        filter,
        skip,
        limit,
        [order.key, order.value],
        searchText
      );
      if (data && data.length > 0) {
        delete filter.lang;
        delete filter.service_type;
        let count = await NotificationResourceAccess.customCount(filter);
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
      let categoryData = req.payload.data;
      let code = req.payload.code;

      let updateResult = await NotificationResourceAccess.updateById(
        code,
        categoryData
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
      const data = await NotificationResourceAccess.userGetDetail(
        req.query.productId,
        req.query.usersId
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
async function deleteById(req) {
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
      let section = await NotificationResourceAccess.deleteByCode(
        req.query.code,
        "id"
      );
      if (section) {
        resolve(section);
      }
      reject("Not found section");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
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
      let category = await NotificationResourceAccess.findById(
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
  deleteById,
};
