"use strict";
const Logger = require('../../../utils/logging');
const QTrafficControlInfoResourceAccess = require('../resourceAccess/QTrafficControlResourceAccess');
const { sendMail } = require("../../../services/utils");
const template = require("../../../config/email.template");
require('dotenv').config();

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await QTrafficControlInfoResourceAccess.customInsert(req.payload);

      if (result) {
        resolve(result);
      } else {
        reject('failed');
      }
    } catch (error) {
      Logger.error('error in insert Intersection ' + error);
      reject('failed');
    }
  })
}

async function get(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      filter.User_ID = req.currentMonitoring.User_ID;
      let result = await QTrafficControlInfoResourceAccess.customFind('findAll', filter, skip, limit);
      if (result) {
        let count = await QTrafficControlInfoResourceAccess.customCount( filter);
        resolve({ data: result, count: count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error('error in get Intersection ' + error);
      reject('failed');
    }
  })
}

async function reportError(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let file_url = req.payload.file_url;
      let description = req.payload.description;
      let intersection_id = req.payload.intersection_id;
      if (!file_url) {
        file_url = '#';
      }
      let html = template.report_error.html
        .replace("{{file_url}}", file_url)
        .replace("{{intersection_id}}", intersection_id)
        .replace("{{description}}", description);
      const res = await sendMail([process.env.SUPPORT_EMAIL], {
        subject: template.report_error.subject,
        html: html,
      });
      if (res) {
        resolve("ok");
      } else {
        reject("failed");
      }
    } catch (error) {
      Logger.error(__filename + ' ' + error);
    }
  })
}
async function getHistoryOutput(req) {
  console.log("get history output");

  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let result = await QTrafficControlInfoResourceAccess.FindHistoryOutput( filter, limit, skip,startDate,endDate);
      if (result) {
        let count = await QTrafficControlInfoResourceAccess.countHistoryOutput(filter,startDate,endDate);
        resolve({ data: result, count: count });
      } else {
        resolve({ data: [], count: 0 });
      }
    } catch (error) {
      Logger.error('error in get Intersection ' + error);
      reject('failed');
    }
  })
}
module.exports = {
  insert,
  get,
  reportError,getHistoryOutput
}