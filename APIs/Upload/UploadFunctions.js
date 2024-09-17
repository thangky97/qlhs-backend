"use strict";

const fs = require("fs");

const Logger = require("../../utils/logging");
const path = require("path");
const extra = require("fs-extra");

//Upload base64 image
//fileFormat: PNG, JPEG, MP4
async function uploadMediaFile(
  fileData,
  fileFormat = "png",
  folderPath = "media/"
) {
  return new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        //fake name with 64 ASCII chars
        let fileName =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15) +
          `.${fileFormat}`;
        let filePath = `uploads/${folderPath}${fileName}`;
        if (fs.existsSync(`uploads/${folderPath}`) === false) {
          fs.mkdirSync(`uploads/${folderPath}`, { recursive: true });
        }
        fs.appendFile(filePath, fileData, (err) => {
          if (err) {
            throw err;
          }
          let mediaUrl = `${process.env.HOST_NAME}/${folderPath}${fileName}`;
          console.log(mediaUrl);
          resolve(mediaUrl);
        });
      }
    } catch (e) {
      Logger.error("UploadFunction" + e);
      reject(undefined);
    }
  });
}

function mergeChunks(chunksDir, outputFilePath, uuId, callback) {
  const chunks = fs.readdirSync(chunksDir);

  chunks.sort((a, b) => {
    return parseInt(a.split("_")[0]) - parseInt(b.split("_")[0]);
  });

  const buffers = [];
  // const writeStream = fs.createWriteStream(outputFilePath);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkPath = path.join(chunksDir, chunk);
    // const readStream = fs.createReadStream(chunkPath);
    // readStream.pipe(writeStream, { end: false });
    const buffer = fs.readFileSync(chunkPath);
    buffers.push(buffer);

    // readStream.on("end", () => {});
  }

  const mergedBuffer = Buffer.concat(buffers);

  // Ghi buffer đã merge vào tệp tin
  fs.writeFile(outputFilePath, mergedBuffer, (err) => {
    fs.rmdir(chunksDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("Lỗi khi xóa các mảnh tệp tin:", err);
        return callback(err, null);
      }

      // Sau khi xóa thành công, gọi callback và trả về mediaUrl
      callback(null, `${process.env.HOST_NAME}/media/${uuId}.mp4`);
    });

    if (err) {
      console.error("Lỗi khi ghi buffer vào tệp tin:", err);
      return;
    }
  });
}

async function deleteFile(pathfile) {
  return new Promise(async (resolve, reject) => {
    const nameUploads = path.join("uploads/media", `${pathfile}`);
    try {
      // Xóa tệp nameUploads
      fs.unlink(nameUploads, (err) => {
        if (err) {
          Logger.error("UploadFunction" + err);
          reject(err); // Trả về lỗi nếu có lỗi xảy ra trong quá trình xóa
        } else {
          // Tệp đã được xóa thành công
          resolve("ok");
        }
      });
    } catch (e) {
      Logger.error("UploadFunction" + e);
      reject(e);
    }
  });
}

async function uploadMediaChunk(chunkData, fileIndex, totalChunks, uuId, type) {
  return new Promise(async (resolve, reject) => {
    const nameUploads = path.join("uploads/media", `${uuId}.mp4`);
    try {
      const uploadDir = path.join("uploads/media", uuId);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      // Lưu mảnh tệp tin vào thư mục lưu trữ tạm thời
      const filePath = path.join(uploadDir, fileIndex);
      fs.appendFileSync(filePath, Buffer.from(chunkData));

      // Kiểm tra xem đã nhận được tất cả các mảnh của tệp tin hay chưa

      // Kiểm tra xem đã nhận đủ số lượng mảnh dự kiến chưa
      const isUploadComplete = parseInt(fileIndex) + 1 == totalChunks;

      if (isUploadComplete) {
        console.log("A");
        // Ghép các mảnh tệp tin thành tệp tin hoàn chỉnh
        // const finalFilePath = path.join(uploadDir, fileIndex + "_complete");
        // fs.renameSync(filePath, finalFilePath);
        mergeChunks(
          uploadDir,
          path.join("uploads/media", `${uuId}.mp4`),
          uuId,
          (error, mediaUrl) => {
            if (error) {
              console.error("Lỗi khi ghép và xóa các mảnh tệp tin:", error);
              reject(error);
            } else {
              console.log("Abbb");
              // Trả về mediaUrl sau khi ghép và xóa thành công
              resolve(mediaUrl);
            }
          }
        );
      } else {
        resolve("Chunk received"); // Trả về khi chỉ nhận được một phần mảnh
      }
    } catch (e) {
      Logger.error("UploadFunction" + e);
      reject(undefined);
    }
  });
}

async function uploadExcel(fileData, fileFormat = "xlsx") {
  return new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        //fake name with 64 ASCII chars
        let fileName =
          "import_" +
          new Date().toJSON().slice(0, 10) +
          "_" +
          Math.random().toString(36).substring(2, 15) +
          "." +
          fileFormat;
        const path = "uploads/import/" + fileName;
        if (fs.existsSync(`uploads/import/`) === false) {
          fs.mkdirSync(`uploads/import/`, { recursive: true });
        }
        fs.appendFile(path, fileData, (err) => {
          if (err) {
            throw err;
          }
          resolve(fileName);
        });
      }
    } catch (e) {
      Logger.error("UploadFunction " + e);
      reject(undefined);
    }
  });
}

async function uploadFileToken(token = "") {
  return new Promise(async (resolve, reject) => {
    try {
      if (fs.existsSync(`uploads/docs/`) === false) {
        fs.mkdirSync(`uploads/docs/`, { recursive: true });
      }
      //fake name with 64 ASCII chars
      let fileName =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        `.txt`;
      fs.writeFileSync(`uploads/docs/${fileName}`, token);
      let mediaUrl = `${process.env.HOST_NAME}/docs/${fileName}`;
      resolve(mediaUrl);
    } catch (e) {
      Logger.error("UploadFunction" + e);
      reject(undefined);
    }
  });
}

module.exports = {
  uploadMediaFile,
  uploadExcel,
  uploadFileToken,
  uploadMediaChunk,
  deleteFile,
};
