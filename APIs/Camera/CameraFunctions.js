"use strict";
const DB = require("../../models");

async function checkAvailableCamera(serviceId, User_ID) {
  let data = await DB.user_product.findOne({
    where: {
      id: serviceId,
    },
    raw: true,
  });

  if (!data) {
    throw "failed";
  }

  let cameraUsed = await DB.m_camera.count({
    where: {
      User_ID: User_ID,
      is_deleted: 0,
    },
  });

  if (data.total_camera && data.total_camera - cameraUsed > 0) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  checkAvailableCamera,
};
