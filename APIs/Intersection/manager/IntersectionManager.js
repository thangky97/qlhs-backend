"use strict";
const Logger = require("../../../utils/logging");
const IntersectionResourceAccess = require("../resourceAccess");
const excelFunction = require("../../../ThirdParty/Excel/excelFunction");
const { uploadExcel } = require("../../Upload/UploadFunctions");
const DB = require("../../../models/index");
const CameraResourceAccess = require("../../Camera/resourceAccess/cameraResourceAccess");

const IntersectionFunctions = require("../IntersectionFunctions");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let serviceId = req.payload.Service_Mapping_ID;
      // let isAvailable = await IntersectionFunctions.checkAvailableIntersection(
      //   serviceId,
      //   req.currentMonitoring.User_ID
      // );
      // if (!isAvailable) {
      //   reject("maximum_allowance");
      //   return;
      // }
      req.payload.User_ID = req.currentMonitoring.User_ID;
      req.payload.Last_Update_By = req.currentMonitoring.User_ID;
      req.payload.CreateDateTime = new Date().toISOString();
      let result = await IntersectionResourceAccess.insert(req.payload);
      if (result) {
        // await DB.t_q_traffic_control_info.create({
        //   User_ID: req.currentMonitoring.User_ID,
        //   Intersection_ID: result.dataValues.Intersection_ID,
        //   DateTime: new Date().toISOString(),
        //   Service_Mapping_ID: serviceId
        // });
        resolve(result);
      } else {
        reject("failed");
      }
    } catch (error) {
      Logger.error("error in insert Intersection " + error);
      reject("failed");
    }
  });
}

async function _checkCameraAvailable(User_ID, verifyService, importCamera) {
  let countCamera = await DB.m_camera.count({
    where: {
      User_ID: User_ID,
      is_deleted: 0,
    },
  });
  let availableCamera = verifyService.total_camera - countCamera;
  if (availableCamera < 0) {
    return 0;
  } else {
    if (availableCamera < importCamera) {
      return availableCamera;
    } else {
      return importCamera;
    }
  }
}

async function _addNewIntersection(
  record,
  User_ID,
  Service_Mapping_ID,
  verifyService
) {
  let insertIntersection = await IntersectionResourceAccess.insert({
    Intersection_name: record.Intersection_name,
    Status: record.Status,
    Last_Update_By: User_ID,
    Service_Mapping_ID: Service_Mapping_ID,
    CreateDateTime: new Date().toISOString(),
    User_ID: User_ID,
  });
  if (insertIntersection && insertIntersection.dataValues) {
    let quantityCameraAvailable = await _checkCameraAvailable(
      User_ID,
      verifyService,
      record.LIST_CAMERA.length
    );
    for (let i = 0; i < quantityCameraAvailable; i++) {
      let currentCamera = record.LIST_CAMERA[i];
      if (!currentCamera) return;

      await CameraResourceAccess.insert({
        IP_Address: currentCamera.IP_Address,
        Control_Type: currentCamera.Control_Type,
        SerialNumber: currentCamera.SerialNumber,
        Status: 1,
        User_ID: User_ID,
        Intersection_ID: insertIntersection.dataValues.Intersection_ID,
        CreateDateTime: new Date().toISOString(),
      });
    }
    // await DB.t_q_traffic_control_info.create({
    //   User_ID: User_ID,
    //   Intersection_ID: insertIntersection.dataValues.Intersection_ID,
    //   DateTime: new Date().toISOString(),
    //   Service_Mapping_ID: Service_Mapping_ID
    // });
    return true;
  } else {
    return;
  }
}

async function _verifyService(id) {
  let data = await DB.user_product.findOne({
    where: {
      id: id,
    },
    raw: true,
  });
  return data;
}

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      await DB.m_intersection.update(
        {
          Last_Update_By: req.currentMonitoring.User_ID,
        },
        {
          where: {
            Intersection_ID: req.payload.Intersection_ID,
          },
        }
      );
      resolve("ok");
    } catch (error) {
      Logger.error(__filename + " " + error);
      reject("failed");
    }
  });
}

module.exports = {
  insert,

  updateById,
};
