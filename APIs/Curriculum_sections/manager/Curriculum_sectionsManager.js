"use strict";
const SectionsResourceAccess = require("../resourceAccess/SectionsResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../Curriculum_sectionsConstant");
const CommonFunctions = require("../../Common/CommonFunctions");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF,
          STAFF_ROLE.MANAGE_SYSTEM
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let SectionsData = req.payload;

      //create new user
      let addResult = await SectionsResourceAccess.insert({
        code: SectionsData.code,
        title: SectionsData.title,
        number_students: SectionsData.number_students,
        time: SectionsData.time,
        date: SectionsData.date,
        password: SectionsData.password,
        instructorId: SectionsData.instructorId,
        productId: SectionsData.productId,
        courseId: SectionsData.courseId,
        description: SectionsData.description,
        status: SectionsData.status,
        lang: SectionsData.lang,
      });

      if (addResult === undefined) {
        reject("can not insert section");
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
          STAFF_ROLE.MANAGE_STAFF,
          STAFF_ROLE.MANAGE_SYSTEM
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

      let sections = await SectionsResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (sections && sections.length > 0) {
        let sectionsCount = await SectionsResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: sections, total: sectionsCount });
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
      // delete filter.name;
      let data = await SectionsResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await SectionsResourceAccess.customCount(filter);
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
          STAFF_ROLE.MANAGE_SYSTEM
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let SectionsData = req.payload.data;
      let sectionId = req.payload.id;

      let updateResult = await SectionsResourceAccess.updateById(
        sectionId,
        SectionsData
      );
      if (updateResult) {
        resolve("success");
      }

      reject("failed to update section");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
}
async function getDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await SectionsResourceAccess.customGetDetail(
        req.query.id
        // req.query.lang
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail section error " + error);
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
          STAFF_ROLE.MANAGE_STAFF,
          STAFF_ROLE.MANAGE_SYSTEM
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let section = await SectionsResourceAccess.findById(req.query.id, "id");
      if (section) {
        delete section.password;
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
async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF,
          STAFF_ROLE.MANAGE_SYSTEM
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let section = await SectionsResourceAccess.deleteById(req.query.id, "id");
      if (section) {
        delete section.password;
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

module.exports = {
  insert,
  find,
  updateById,
  findById,
  getList,
  getDetail,
  deleteById,
};
