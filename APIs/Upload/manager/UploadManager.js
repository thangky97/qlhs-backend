"use strict";
const UploadFunctions = require("../UploadFunctions");
const Logger = require("../../../utils/logging");
var multiparty = require("multiparty");

async function uploadMediaFile(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const imageData = req.payload.imageData;
      const imageFormat = req.payload.imageFormat;

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
        resolve(newMediaUrl);
      } else {
        reject("failed to upload");
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}

async function uploadMediaChunk(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const chunk = req.payload.chunk;
      const fileId = req.payload.chunkIndex;
      const totalChunks = req.payload.totalChunks;
      const uuId = req.payload.uuId;
      const type = req.payload.type;

      if (!chunk) {
        reject("do not have book data");
        return;
      }

      let newMediaUrl = await UploadFunctions.uploadMediaChunk(
        chunk,
        fileId,
        totalChunks,
        uuId,
        type
      );
      if (newMediaUrl) {
        resolve(newMediaUrl);
      } else {
        reject("failed to upload");
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}
async function deleteFile(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const pathfile = req.payload.pathfile;

      if (!pathfile) {
        reject("do not have path");
        return;
      }

      let Path = await UploadFunctions.deleteFile(pathfile);
      console.log("Path", Path);
      if (Path) {
        resolve(Path);
      } else {
        reject("failed to upload");
      }
    } catch (e) {
      Logger.error(__filename + e);
      reject("failed");
    }
  });
}
module.exports = {
  uploadMediaFile,
  uploadMediaChunk,
  deleteFile,
};
