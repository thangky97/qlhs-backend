const excelFunction = require("../../ThirdParty/Excel/excelFunction");
const moment = require("moment");
const MESSAGE = require("./messageConstant");

async function exportExcelData(
  records,
  fileName,
  startDate,
  endDate,
  intersection_id,
  lang
) {
  const workSheetName = MESSAGE[lang].traffic_data;
  const dataRows = [];

  //worksheet title
  const workSheetTitle = [
    MESSAGE[lang].intersection,
    "",
    "",
    "",
    "",
    "",
    MESSAGE[lang].report_time,
    "",
    "",
    "",
  ];
  dataRows.push(workSheetTitle);

  let reportTime = ``;
  if (startDate || endDate) {
    startDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    endDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    reportTime = `${
      startDate ? `${MESSAGE[lang].from_date} ` + startDate : ""
    } ${endDate ? `${MESSAGE[lang].to_date} ` + endDate : ""}`;
  }

  const workSheetInfo = [
    `${intersection_id}`,
    "", //break 1 columns
    "", //break 1 columns
    "", //break 1 columns
    "", //break 1 columns
    "", //break 1 columns
    reportTime, //break 1 columns
    "", //break 1 columns
    "", //break 1 columns
    "",
  ];
  dataRows.push(workSheetInfo);
  dataRows.push([""]); //break 1 rows

  //table headers
  const workSheetColumnNames = [
    "",
    MESSAGE[lang].time,
    MESSAGE[lang].intersection_name,
    MESSAGE[lang].camera_id,
    MESSAGE[lang].ip_address,
    MESSAGE[lang].vehicle_l,
    MESSAGE[lang].vehicle_m,
    MESSAGE[lang].vehicle_s,
  ];
  dataRows.push(workSheetColumnNames);

  //Table data
  records.forEach((record, index) => {
    var newDate = moment(record.DateTime).format("YYYY-MM-DD HH:mm:ss");
    dataRows.push([
      index,
      newDate,
      record["M_Intersection.Intersection_name"],
      record["Camera_ID"],
      record["M_Camera.IP_Address"],
      record["Vehicle_L"],
      record["Vehicle_M"],
      record["Vehicle_S"],
    ]);
  });
  excelFunction.exportExcelOldFormat(dataRows, workSheetName, fileName);
  return "OK";
}

module.exports = {
  exportExcelData,
};
