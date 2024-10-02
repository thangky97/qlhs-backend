"use strict";
const DocumentationFunctions = require("../DocumentationFunctions");
const Logger = require("../../../utils/logging");
const DocumentationResourceAccess = require("../resourceAccess/DocumentationResourceAccess");
const config = require("../../../config");
const { STAFF_ROLE } = require("../../Staff/StaffConstant");
const CommonFunctions = require("../../Common/CommonFunctions");

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let language = req.payload.language
        ? req.payload.language
        : config.LANG_DEFAULT;
      let data = await DocumentationResourceAccess.find(
        filter,
        language,
        skip,
        limit,
        [order.key, order.value]
      );
      if (data && data.length > 0) {
        let count = await DocumentationResourceAccess.count(filter);
        resolve({ data: data, total: count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function create(req) {
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
      let data = await DocumentationResourceAccess.create(req.payload);
      resolve({ data: data });
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function update(req) {
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
      let document_id = req.payload.document_id;
      delete req.payload.document_id;
      let data = await DocumentationResourceAccess.updateById(
        document_id,
        req.payload
      );
      resolve({ data: data });
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function detail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let document_id = req.payload.document_id;
      let language = req.payload.language;
      let data = await DocumentationResourceAccess.findById(
        document_id,
        language
      );
      resolve({ data: data });
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

module.exports = {
  find,
  create,
  update,
  detail,
};
