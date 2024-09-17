"use strict";
const { Op } = require('sequelize');
const Logger = require('../../../utils/logging');
const CameraResourceAccess = require('../resourceAccess/cameraResourceAccess');
const CameraFunctions = require('../CameraFunctions');
const SettingResourceAccess = require('../../Q_Traffic_Control_Info/resourceAccess/SettingResourceAccess');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      // check available camera
      let serviceId = req.payload.Service_Mapping_ID;
      let isAvailable = await CameraFunctions.checkAvailableCamera(serviceId, req.currentMonitoring.User_ID);
      if (!isAvailable) {
        reject('maximum_allowance');
        return;
      }
      delete req.payload.Service_Mapping_ID;
      req.payload.CreateDateTime = new Date().toISOString();
      req.payload.User_ID = req.currentMonitoring.User_ID;
      let result = await CameraResourceAccess.insert(req.payload)
      if (result) {
        await SettingResourceAccess.updateById(req.payload.Intersection_ID, {
          Last_Update_By: req.currentMonitoring.User_ID
        });
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (error) {
      Logger.error('error in insert Camera ' + error);
      reject('failed');
    }
  })
}

async function _getCamera(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      filter.User_ID = req.currentMonitoring.User_ID;
      let result = await CameraResourceAccess.customFind(filter, skip, limit);
      if (result) {
        let count = await CameraResourceAccess.customCount(filter);
        resolve({ data: result, count: count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error("get camera error " + error);
      reject('failed');
    }
  })
}

async function getCameraAvailable(req) {
  req.payload.filter.Intersection_ID = {
    [Op.is]: null
  };
  return await _getCamera(req);
}

async function getIntersectionCamera(req) {
  return await _getCamera(req);
}

async function updateCamera(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.payload.id;
      let data = req.payload.data;

      let result = await CameraResourceAccess.updateById(id, data);
      if (result) {
        await SettingResourceAccess.updateById(data.Intersection_ID, {
          Last_Update_By: req.currentMonitoring.User_ID
        });
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (error) {
      Logger.error(__filename + " " + error);
    }
  })
}

async function deteleCamera(req) {
  return new Promise(async (resolve, reject) => {
    try {
      await CameraResourceAccess.updateById(req.payload.camera_id, { is_deleted: 1 });
      resolve('ok');
    } catch (error) {
      Logger.error(__filename + " " + error);
    }
  })
}

module.exports = {
  insert, getCameraAvailable,
  getIntersectionCamera,
  updateCamera,
  deteleCamera
}