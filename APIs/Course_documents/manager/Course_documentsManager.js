"use strict";
const DocumentsResourceAccess = require("../resourceAccess/DocumentsResourceAccess");
const Logger = require("../../../utils/logging");
const { category_ERROR, STAFF_ROLE } = require("../Course_documentsConstant");
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
      let DoccumentData = req.payload;

      //create new user
      let addResult = await DocumentsResourceAccess.insert({
        name: DoccumentData.name,
        fileurl: DoccumentData.fileurl,
        content: DoccumentData.content,
        short_content: DoccumentData.short_content,
        status: DoccumentData.status,
        show_download: DoccumentData.show_download,
        lang: DoccumentData.lang,
        author: DoccumentData.author,
        sort_order: DoccumentData.sort_order,
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

      let sections = await DocumentsResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (sections && sections.length > 0) {
        let sectionsCount = await DocumentsResourceAccess.count(filter, [
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
      let data = await DocumentsResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await DocumentsResourceAccess.customCount(filter);
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
      let DoccumentData = req.payload.data;
      let sectionId = req.payload.id;

      let updateResult = await DocumentsResourceAccess.updateById(
        sectionId,
        DoccumentData
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
      const data = await DocumentsResourceAccess.customGetDetail(
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
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let section = await DocumentsResourceAccess.findById(req.query.id, "id");
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

async function deleteId(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await DocumentsResourceAccess.deleteById(
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

module.exports = {
  insert,
  find,
  updateById,
  findById,
  getList,
  getDetail,
  deleteId,
};
