"use strict";
const Logger = require("../../../utils/logging");
const QTrafficStatusImageResourceAccess = require("../resourceAccess/QTrafficStatusImageResourceAccess");
const UploadFunctions = require("../../Upload/UploadFunctions");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const imageData = req.payload.imageData;
      const imageFormat = req.payload.imageFormat;
      const intersectionId = req.payload.intersectionId;
      const Camera_ID = req.payload.Camera_ID;
      if (!imageData) {
        reject("do not have book data");
        return;
      }

      var originaldata = Buffer.from(imageData, "base64");
      let newMediaUrl = await UploadFunctions.uploadMediaFile(
        originaldata,
        imageFormat
      );
      if (newMediaUrl) {
        await QTrafficStatusImageResourceAccess.customInsert({
          Media_URL: newMediaUrl,
          Media_Type: imageFormat,
          DateTime: new Date().toISOString(),
          Intersection_ID: intersectionId,
          Camera_ID: Camera_ID,
        });
        resolve(newMediaUrl);
      } else {
        reject("failed to upload");
      }
    } catch (error) {
      console.error(__filename, error);
      reject("failed");
    }
  });
}

async function get(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let result = await QTrafficStatusImageResourceAccess.customFind(
        "findAll",
        filter,
        limit,
        skip
      );
      if (result) {
        let count = await QTrafficStatusImageResourceAccess.customFind(
          "count",
          filter
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

async function getHistoryInput(req) {
  console.log("get history input");
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let result = await QTrafficStatusImageResourceAccess.FindHistoryInput(
        "findAll",
        filter,
        limit,
        skip
      );
      if (result) {
        let count = await QTrafficStatusImageResourceAccess.FindHistoryInput(
          "count",
          filter
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

async function robotInsertMedia(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileData = req.payload.fileData;
      const imageFormat = req.payload.imageFormat;
      const intersectionId = req.payload.intersectionId;
      const Camera_ID = req.payload.Camera_ID;
      if (!fileData) {
        reject("do not have book data");
        return;
      }

      var originaldata = Buffer.from(fileData, "base64");
      let newMediaUrl = await UploadFunctions.uploadMediaFile(
        originaldata,
        imageFormat
      );
      if (newMediaUrl) {
        await QTrafficStatusImageResourceAccess.customInsert({
          Media_URL: newMediaUrl,
          Media_Type: imageFormat,
          DateTime: new Date().toISOString(),
          Intersection_ID: intersectionId,
          Camera_ID: Camera_ID,
        });
        resolve(newMediaUrl);
      } else {
        reject("failed to upload");
      }
    } catch (error) {
      console.error(__filename, error);
      reject("failed");
    }
  });
}

module.exports = {
  insert,
  get,
  robotInsertMedia,
  getHistoryInput,
};
