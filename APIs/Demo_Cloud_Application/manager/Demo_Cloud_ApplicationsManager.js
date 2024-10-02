"use strict";
const Demo_Cloud_ApplicationResourceAccess = require("../resourceAccess/Demo_Cloud_ApplicationResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../Demo_Cloud_ApplicationConstant");
const CommonFunctions = require("../../Common/CommonFunctions");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      // if (
      //   (await CommonFunctions.verifyRole(
      //     req.currentUser,
      //     STAFF_ROLE.MANAGE_STAFF
      //   )) == false
      // ) {
      //   reject("NOT_ALLOWED");
      //   return;
      // }
      let Demo_Cloud_ApplicationData = req.payload;
      let maxIndex =
        await Demo_Cloud_ApplicationResourceAccess.getMaxPriorityIndex();
      //create new user
      let addResult = await Demo_Cloud_ApplicationResourceAccess.insert({
        short_description: Demo_Cloud_ApplicationData.short_description,
        long_description: Demo_Cloud_ApplicationData.long_description,
        image: Demo_Cloud_ApplicationData.image,
        lang: Demo_Cloud_ApplicationData.lang,
        demo_url: Demo_Cloud_ApplicationData.demo_url,
        sample_code: Demo_Cloud_ApplicationData.sample_code,
        priority_index: Demo_Cloud_ApplicationData.priority_index,
      });
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
      // if (
      //   (await CommonFunctions.verifyRole(
      //     req.currentUser,
      //     STAFF_ROLE.MANAGE_STAFF
      //   )) == false
      // ) {
      //   reject("NOT_ALLOWED");
      //   return;
      // }
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      if (!filter) {
        filter = {};
      }

      let Demo_Cloud_Application =
        await Demo_Cloud_ApplicationResourceAccess.customFind(
          filter,
          skip,
          limit,
          order
        );

      if (Demo_Cloud_Application && Demo_Cloud_Application.length > 0) {
        let Demo_Cloud_ApplicationCount =
          await Demo_Cloud_ApplicationResourceAccess.count(filter, [
            order.key,
            order.value,
          ]);
        resolve({
          data: Demo_Cloud_Application,
          total: Demo_Cloud_ApplicationCount,
        });
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
      let data = await Demo_Cloud_ApplicationResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        delete filter.lang;
        delete filter.service_type;
        let count = await Demo_Cloud_ApplicationResourceAccess.customCount(
          filter
        );
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
      // if (
      //   (await CommonFunctions.verifyRole(
      //     req.currentUser,
      //     STAFF_ROLE.MANAGE_STAFF
      //   )) == false
      // ) {
      //   reject("NOT_ALLOWED");
      //   return;
      // }
      let Demo_Cloud_ApplicationData = req.payload.data;
      let Demo_Cloud_ApplicationId = req.payload.id;

      let updateResult = await Demo_Cloud_ApplicationResourceAccess.updateById(
        Demo_Cloud_ApplicationId,
        Demo_Cloud_ApplicationData
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
      const data = await Demo_Cloud_ApplicationResourceAccess.customGetDetail(
        req.query.id
        // req.query.lang
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail Demo_Cloud_Application error " + error);
      reject("failed");
    }
  });
}
async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      // if (
      //   (await CommonFunctions.verifyRole(
      //     req.currentUser,
      //     STAFF_ROLE.MANAGE_STAFF
      //   )) == false
      // ) {
      //   reject("NOT_ALLOWED");
      //   return;
      // }
      let Demo_Cloud_Application =
        await Demo_Cloud_ApplicationResourceAccess.findById(req.query.id, "id");
      if (Demo_Cloud_Application) {
        delete Demo_Cloud_Application.password;
        resolve(Demo_Cloud_Application);
      }
      reject("Not found Demo_Cloud_Application");
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

      let res = await Demo_Cloud_ApplicationResourceAccess.deleteById(id);
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
