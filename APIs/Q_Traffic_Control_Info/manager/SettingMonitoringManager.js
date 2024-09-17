"use strict";
const Logger = require('../../../utils/logging');
const SettingResourceAccess = require('../resourceAccess/SettingResourceAccess');
const DB = require("../../../models");
async function get(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      filter.User_ID = req.currentMonitoring.User_ID;
      let dataSetting = await SettingResourceAccess.customFind('findAll', filter, limit, skip);
      if (dataSetting && dataSetting.length > 0) {
        let count = await SettingResourceAccess.customFind('count', filter);
        resolve({ data: dataSetting, count: count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error(__filename + " " + error);
      reject(error);
    }
  })
}

async function getDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let intersectionId = req.query.intersectionId;

      let dataSetting = await SettingResourceAccess.getDetailIntersection(intersectionId);
      if (dataSetting) {
        resolve(dataSetting);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error(__filename + " " + error);
      reject(error);
    }
  })
}

async function deleteSetting(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let intersection_id = req.payload.intersection_id;
      await SettingResourceAccess.updateById(intersection_id, { is_deleted: 1 });
      await DB.m_camera.update({ is_deleted: 1}, { where: { Intersection_ID: intersection_id }})
      resolve('success');
    } catch (error) {
      Logger.error(__filename + ' ' + error);
      reject('failed');
    }
  })
}

module.exports = {
  get, getDetail,
  deleteSetting
}