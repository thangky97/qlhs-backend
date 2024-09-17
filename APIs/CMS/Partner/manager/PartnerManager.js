"use strict";
const Logger = require("../../../../utils/logging");
const PartnerResourceAccess = require("../resourceAccess/PartnerResourceAccess");
const CommonFunctions = require('../../../Common/CommonFunctions');
const { STAFF_ROLE } = require('../../../Staff/StaffConstant');

async function findAll() {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await PartnerResourceAccess.findAll({});
      if (data && data.length > 0) {
        resolve({ data, total: data.length });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (await CommonFunctions.verifyRole(req.currentUser, STAFF_ROLE.MANAGE_SYSTEM) == false) {
        reject("NOT_ALLOWED");
        return;
      }
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let data = await PartnerResourceAccess.customFind(filter, skip, limit);
      if (data && data.length > 0) {
        let count = await PartnerResourceAccess.customCount(filter);

        resolve({ data, total: count });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
  });
}

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (await CommonFunctions.verifyRole(req.currentUser, STAFF_ROLE.MANAGE_SYSTEM) == false) {
        reject("NOT_ALLOWED");
        return;
      }
      let addPartner = req.payload;
      if (addPartner.priority_index === null || addPartner.priority_index === undefined) {
        // priority_index = max
        let maxIndex = await PartnerResourceAccess.getMaxPriorityIndex();
        addPartner.priority_index = maxIndex.max + 1;
      } else {
        // check priority_index is exist
        let isExist = await PartnerResourceAccess.checkExistingIndex(addPartner.priority_index);
        if (isExist) {
          reject("priority_index is exist");
          return;
        }
      }

      let data = await PartnerResourceAccess.insert(addPartner);
      if (data.dataValues) {
        resolve(data.dataValues);
      } else {
        resolve('failed');
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function deleteById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (await CommonFunctions.verifyRole(req.currentUser, STAFF_ROLE.MANAGE_SYSTEM) == false) {
        reject("NOT_ALLOWED");
        return;
      }
      let data = await PartnerResourceAccess.deleteById(req.query.id);
      if (data) {
        resolve(data);
      } else {
        reject("delete failed");
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
      let id = req.payload.id;
      let data = req.payload.data;
      if (data.priority_index !== null && data.priority_index !== undefined) {
        // check priority_index is exist => switch priority_index
        let currentDataOfIndex = await PartnerResourceAccess.checkExistingIndex(data.priority_index);
        if (currentDataOfIndex) {
          let currentDataIndex = await PartnerResourceAccess.findById(id);
          await PartnerResourceAccess.updateById(currentDataOfIndex.id, { priority_index: currentDataIndex.priority_index });
        }
      }
      let res = await PartnerResourceAccess.updateById(id, data);
      if (res) {
        resolve(res);
      } else {
        reject("update failed");
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function getDetailById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await PartnerResourceAccess.findById(req.query.id);
      if (data) {
        resolve(data);
      } else {
        reject({});
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

module.exports = {
  findAll,
  find,
  insert,
  deleteById,
  updateById,
  getDetailById
};
