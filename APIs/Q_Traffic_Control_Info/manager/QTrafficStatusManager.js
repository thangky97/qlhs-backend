"use strict";
const Logger = require("../../../utils/logging");
const QTrafficStatusResourceAccess = require("../resourceAccess/QTrafficStatusResourceAccess");
const QTrafficMediaFunction = require("../QTrafficMediaFunctions");
const { log } = require("winston");

async function getQTrafficStatus(req) {
  console.log("api nay ne");
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let limit = req.payload.limit;
      let skip = req.payload.skip;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;

      let qTrafficStatus = await QTrafficStatusResourceAccess.customFind(
        filter,
        limit,
        skip,
        startDate,
        endDate
      );

      if (qTrafficStatus && qTrafficStatus.length > 0) {
        let count = await QTrafficStatusResourceAccess.customeCount(
          filter,
          startDate,
          endDate
        );
        resolve({ data: qTrafficStatus, count: count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error(error);
      reject("failed");
    }
  });
}
async function getHistoryOutput(req) {
  console.log("get history output");

  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let result = await QTrafficStatusResourceAccess.FindHistoryOutput(
        filter,
        limit,
        skip,
        startDate,
        endDate
      );
      if (result) {
        let count = await QTrafficStatusResourceAccess.countHistoryOutput(
          filter,
          startDate,
          endDate
        );
        resolve({ data: result, count: count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error("error in get Intersection " + error);
      reject("failed");
    }
  });
}
async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await QTrafficStatusResourceAccess.customInsert(req.payload);
      if (result) {
        resolve(result);
      } else {
        reject("failed");
      }
    } catch (error) {
      Logger.error(error);
      reject("failed");
      console.log("loi nay  ");
      console.log(error);
    }
  });
}

async function exportData(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let intersection_id = req.payload.intersection_id;
      let lang = req.payload.lang;
      let dataTraffic = await QTrafficStatusResourceAccess.findAll({
        Intersection_ID: intersection_id,
        startDate: startDate,
        endDate: endDate,
      });
      if (dataTraffic && dataTraffic.length > 0) {
        const fileName = "data_traffic_" + (new Date() - 1).toString();
        let url = `${process.env.HOST_NAME}/export/${fileName}.xlsx`;
        let isExported = await QTrafficMediaFunction.exportExcelData(
          dataTraffic,
          `${fileName}.xlsx`,
          startDate,
          endDate,
          intersection_id,
          lang
        );
        if (isExported) {
          resolve(url);
        } else {
          reject("no data");
        }
      } else {
        reject("no data");
      }
    } catch (error) {
      Logger.error(__filename + " " + error);
      reject("failed");
    }
  });
}

module.exports = {
  insert,
  exportData,
  getQTrafficStatus,
  getHistoryOutput,
};
