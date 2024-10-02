"use strict";
const RollCallResourceAccess = require("../resourceAccess/RollCallResourceAccess");
const HistoryResourceAccess = require("../../History/resourceAccess/HistoryResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../Roll_CallConstant");
const CommonFunctions = require("../../Common/CommonFunctions");
const excelFunction = require("../../../ThirdParty/Excel/excelFunction");
const { uploadExcel } = require("../../Upload/UploadFunctions");

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

      const isManageUser = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_USER
      );

      if (!isManageStaff && !isManageSystem && !isManageUser) {
        reject("NOT_ALLOWED");
        return;
      }
      let RollCallData = req.payload;

      let addResult = await RollCallResourceAccess.insert({
        curriculumSectionId: RollCallData.curriculumSectionId,
        time: RollCallData.time,
        date: RollCallData.date,
        userId: RollCallData.userId,
        note: RollCallData.note,
        status: RollCallData.status,
      });

      if (addResult === undefined) {
        reject("can not insert roll call");
        return;
      } else {
        resolve(addResult);
      }
      return;
    } catch (e) {
      Logger.error(`${__filename} ${e}`);
      reject("failed");
    }
  });
}

async function find(req) {
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

      const isManageUser = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_USER
      );

      if (!isManageStaff && !isManageSystem && !isManageUser) {
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

      let data = await RollCallResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (data && data.length > 0) {
        let dataCount = await RollCallResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: data, total: dataCount });
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
      // delete filter.name;
      let data = await RollCallResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await RollCallResourceAccess.customCount(filter);
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
// async function updateById(req) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (
//         (await CommonFunctions.verifyRole(
//           req.currentUser,
//           STAFF_ROLE.MANAGE_STAFF,
//           STAFF_ROLE.MANAGE_SYSTEM
//         )) == false
//       ) {
//         reject("NOT_ALLOWED");
//         return;
//       }
//       let RollCallData = req.payload.data;
//       let rollcallId = req.payload.id;

//       let updateResult = await RollCallResourceAccess.updateById(
//         rollcallId,
//         RollCallData
//       );
//       if (updateResult) {
//         resolve("success");
//       }

//       reject("failed to update roll call");
//     } catch (e) {
//       Logger.error(__filename + e);
//       reject(e);
//     }
//   });
// }
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

      const isManageUser = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_USER
      );

      if (!isManageStaff && !isManageSystem && !isManageUser) {
        reject("NOT_ALLOWED");
        return;
      }

      // Duyệt qua từng đối tượng trong mảng payload
      for (const item of req.payload) {
        let rollcallId = item.id; // Lấy id
        let RollCallData = item.data; // Lấy dữ liệu

        // Kiểm tra xem id có hợp lệ không
        if (rollcallId === undefined) {
          reject("Invalid ID");
          return;
        }

        // Cập nhật dữ liệu điểm danh
        let updateResult = await RollCallResourceAccess.updateById(
          rollcallId,
          RollCallData
        );

        if (!updateResult) {
          reject("Failed to update roll call for ID: " + rollcallId);
          return;
        }
      }

      // Thêm bản ghi vào HistoryResourceAccess
      for (const item of req.payload) {
        let rollcallId = item.id;
        let RollCallData = item.data;

        const insertResult = await HistoryResourceAccess.insert({
          rollCallId: rollcallId, // Sử dụng rollcallId cho từng mục
          time: RollCallData.time,
          date: RollCallData.date,
          userId: RollCallData.userId,
          note: RollCallData.note,
          status: RollCallData.status,
        });

        // Kiểm tra kết quả chèn
        if (!insertResult) {
          reject("Failed to insert history for ID: " + rollcallId);
          return;
        }
      }

      resolve("success");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
}

async function getDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await RollCallResourceAccess.customGetDetail(
        req.query.id
        // req.query.lang
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail roll call error " + error);
      reject("failed");
    }
  });
}
async function findById(req) {
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

      const isManageUser = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_USER
      );

      if (!isManageStaff && !isManageSystem && !isManageUser) {
        reject("NOT_ALLOWED");
        return;
      }
      let data = await RollCallResourceAccess.findById(req.query.id, "id");
      if (data) {
        delete data.password;
        resolve(data);
      }
      reject("Not found roll call");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
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

      const isManageUser = await CommonFunctions.verifyRole(
        req.currentUser,
        STAFF_ROLE.MANAGE_USER
      );

      if (!isManageStaff && !isManageSystem && !isManageUser) {
        reject("NOT_ALLOWED");
        return;
      }
      let data = await RollCallResourceAccess.deleteById(req.query.id, "id");
      if (data) {
        delete data.password;
        resolve(data);
      }
      reject("Not found roll call");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
  });
}

async function importRollCall(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let fileData = req.payload.file;
      let fileFormat = req.payload.fileFormat;

      var originaldata = Buffer.from(fileData, "base64");
      let newExcel = await uploadExcel(originaldata, fileFormat);
      if (newExcel) {
        let path = "uploads/import/" + newExcel;
        let excelData = await excelFunction.importExcelOldformat(path);
        console.log("excelData", excelData);

        if (excelData === undefined) {
          reject("failed to import");
        } else {
          let importSuccessCount = 0;

          for (var i = 0; i < excelData.data.length; i++) {
            let { dataRollCall } = excelData.data[i];

            // Thêm public key vào bảng public key
            let addResult = await RollCallResourceAccess.insert(dataRollCall);
          }

          resolve({ data: importSuccessCount, total: excelData.total });
        }
      } else {
        reject("failed to upload");
      }
    } catch (error) {
      Logger.error(__filename + " " + error);
      reject("failed");
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  getList,
  getDetail,
  deleteById,
  importRollCall,
};
