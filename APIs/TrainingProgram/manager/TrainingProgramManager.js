"use strict";
const TrainingProgramResourceAccess = require("../resourceAccess/TrainingProgramResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../TrainingProgramConstant");
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
      let trainingProgramData = req.payload;

      //create new user
      let addResult = await TrainingProgramResourceAccess.insert(
        trainingProgramData
      );
      if (addResult === undefined) {
        reject("can not insert training program");
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

      let training_rograms = await TrainingProgramResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (training_rograms && training_rograms.length > 0) {
        let TrainingProgramCount = await TrainingProgramResourceAccess.count(
          filter,
          [order.key, order.value]
        );
        resolve({ data: training_rograms, total: TrainingProgramCount });
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
      let data = await TrainingProgramResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await TrainingProgramResourceAccess.customCount(filter);
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

      let TrainingProgramId = req.payload.id;
      let TrainingProgramData = req.payload.data;

      let updateResult = await TrainingProgramResourceAccess.updateById(
        TrainingProgramId,
        TrainingProgramData
      );

      if (updateResult) {
        delete updateResult.password;
        resolve(updateResult);
      }

      reject("failed to update training program");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
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
      let training_programs = await TrainingProgramResourceAccess.findById(
        req.query.id,
        "id"
      );
      if (training_programs) {
        delete training_programs.password;
        resolve(training_programs);
      }
      reject("Not found training program");
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
};
