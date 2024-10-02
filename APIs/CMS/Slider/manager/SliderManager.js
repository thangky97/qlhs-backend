"use strict";
const Logger = require("../../../../utils/logging");
const SliderResourceAccess = require("../resourceAccess/SliderResourceAccess");
const CommonFunctions = require("../../../Common/CommonFunctions");
const { STAFF_ROLE } = require("../../../Staff/StaffConstant");

async function findAll(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await SliderResourceAccess.findAll({
        lang: req.query.lang,
      });

      if (data && data.length > 0) {
        resolve({ data, total: data.length });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let data = await SliderResourceAccess.find(filter);

      if (data && data.length > 0) {
        resolve({ data, total: data.length });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

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

      if (!isManageStaff && !isManageSystem) {
        reject("NOT_ALLOWED");
        return;
      }
      let addSlide = req.payload;
      if (
        addSlide.priority_index === null ||
        addSlide.priority_index === undefined
      ) {
        // priority_index = max
        let maxIndex = await SliderResourceAccess.getMaxPriorityIndex({
          lang: addSlide.lang,
        });
        addSlide.priority_index = maxIndex.max + 1;
      } else {
        // check priority_index is exist
        let isExist = await SliderResourceAccess.checkExistingIndex(
          { lang: addSlide.lang },
          addSlide.priority_index
        );
        if (isExist) {
          reject("priority_index is exist");
          return;
        }
      }
      let data = await SliderResourceAccess.insert(addSlide);

      if (data.dataValues) {
        resolve(data.dataValues);
      } else {
        reject("failed");
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
      const isManageStaff = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      );
      const isManageSystem = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_SYSTEM
      );

      if (!isManageStaff && !isManageSystem) {
        reject("NOT_ALLOWED");
        return;
      }
      let data = await SliderResourceAccess.deleteById(req.query.id);
      if (data) {
        resolve("ok");
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
      const isManageStaff = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_STAFF
      );
      const isManageSystem = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_SYSTEM
      );

      if (!isManageStaff && !isManageSystem) {
        reject("NOT_ALLOWED");
        return;
      }
      let data = req.payload.data;
      let id = req.payload.id;

      if (data.priority_index !== null && data.priority_index !== undefined) {
        // check priority_index is exist => switch priority_index
        let currentDataOfIndex = await SliderResourceAccess.checkExistingIndex(
          { lang: data.lang },
          data.priority_index
        );
        if (currentDataOfIndex) {
          let currentDataIndex = await SliderResourceAccess.findById(id);
          await SliderResourceAccess.updateById(currentDataOfIndex.id, {
            priority_index: currentDataIndex.priority_index,
          });
        }
      }
      let res = await SliderResourceAccess.updateById(id, data);
      if (res) {
        resolve("ok");
      } else {
        reject("delete failed");
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
      let data = await SliderResourceAccess.findById(req.query.id);
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
  getDetailById,
};
