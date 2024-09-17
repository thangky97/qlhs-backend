"use strict";
const fs = require("fs");
const xlsx = require("xlsx");
const path = require("path");
const moment = require("moment");

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumnNames, ...data];
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(filePath));
};

async function importExcel(filePath) {
  var workBook = xlsx.readFile(filePath);
  var workSheet = workBook.Sheets[workBook.SheetNames[0]];
  var data = xlsx.utils.sheet_to_json(workSheet);
  var name;
  var bxs;
  var sdt;
  var email;
  var fullData = [];
  for (let index = 2; index < data.length + 2; index++) {
    if (
      workSheet[`B${index}`] === undefined ||
      workSheet[`C${index}`] === undefined ||
      workSheet[`D${index}`] === undefined
    ) {
      continue; //neu row bi loi thi bo qua, khong can import
    } else {
      bxs = workSheet[`B${index}`].v;
      sdt = workSheet[`C${index}`].v;
      customerRecordCheckExpiredDate = workSheet[`D${index}`].v;
    }
    if (workSheet[`E${index}`] === undefined) {
      name = "";
    } else {
      name = workSheet[`E${index}`].v;
    }
    if (workSheet[`F${index}`] === undefined) {
      email = "";
    } else {
      email = workSheet[`F${index}`].v;
    }
    fullData.push({
      customerRecordFullName: name,
      customerRecordPlatenumber: bxs,
      customerRecordPhone: sdt.toString(),
      customerRecordEmail: email,
      customerRecordCheckExpiredDate: customerRecordCheckExpiredDate,
    });
  }
  return fullData;
}

const exportExcelOldFormat = (dataRows, workSheetName, fileName) => {
  if (fs.existsSync(`uploads/export/`) === false) {
    fs.mkdirSync(`uploads/export/`, { recursive: true });
  }
  const workBook = xlsx.utils.book_new();
  const workSheetData = dataRows;
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(`uploads/export/${fileName}`));
};

async function importExcelOldformat(filePath) {
  var workBook = xlsx.readFile(filePath);
  var workSheet = workBook.Sheets[workBook.SheetNames[0]];
  // var dataJSON = xlsx.utils.sheet_to_json(workSheet);
  var fullData = [];

  var keys = Object.keys(workSheet);
  const TOTAL = keys.length - 2;
  let lastIntersectionIndex;
  let totalInsertRecord = 0;
  for (let index = 7; index < TOTAL; index++) {
    if (keys[index].indexOf("A") > -1) {
      // new Intersection_name
      fullData.push({
        Intersection_name: workSheet[keys[index + 2]].w,
        Status: 1,
        LIST_CAMERA: [],
      });
      index += 2;
      lastIntersectionIndex = fullData.length - 1;
      totalInsertRecord++;
    } else {
      // console.info('camera', keys[index], workSheet[keys[index]]  )
      fullData[lastIntersectionIndex].LIST_CAMERA.push({
        IP_Address: workSheet[keys[index]].w,
        Control_Type: workSheet[keys[index + 2]].w,
        SerialNumber: workSheet[keys[index + 1]].w,
        Status: 1,
      });
      totalInsertRecord++;
      index += 2;
    }
  }

  return {
    data: fullData,
    total: totalInsertRecord,
  };
}

module.exports = {
  exportExcel,
  importExcel,
  importExcelOldformat,
  exportExcelOldFormat,
};
