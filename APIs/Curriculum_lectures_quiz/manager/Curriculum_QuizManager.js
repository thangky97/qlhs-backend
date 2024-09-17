"use strict";
const QuizsResourceAccess = require("../resourceAccess/Lectures_QuizResourceAccess");
const Logger = require("../../../utils/logging");
const { STAFF_ROLE } = require("../Curriculum_Lectures_QuizConstant");
const CommonFunctions = require("../../Common/CommonFunctions");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let QuizsData = req.payload;

      //create new user
      let maxIndex = await QuizsResourceAccess.getMaxPriorityIndex();
      let addResult = await QuizsResourceAccess.insert({
        type: QuizsData.type,
        lang: QuizsData.lang,
        title: QuizsData.title,
        description: QuizsData.description,
        contenttext: QuizsData.contenttext,
        media: QuizsData.media,
        resources: QuizsData.resources,
        correct_answer: QuizsData.correct_answer,
        answer: QuizsData.answer,
        sort_order: QuizsData.sort_order,
        media_type: QuizsData.media_type,
        publish: QuizsData.publish,
        status: QuizsData.status,
        sort_order: maxIndex.max + 1,
      });
      console.log(addResult);
      if (addResult === undefined) {
        reject("can not insert category");
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
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
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

      let Quizs = await QuizsResourceAccess.customFind(
        filter,
        skip,
        limit,
        order
      );

      if (Quizs && Quizs.length > 0) {
        let QuizsCount = await QuizsResourceAccess.count(filter, [
          order.key,
          order.value,
        ]);
        resolve({ data: Quizs, total: QuizsCount });
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
      let data = await QuizsResourceAccess.customFind(
        filter,
        skip,
        limit,
        order,
        searchText
      );
      if (data && data.length > 0) {
        let count = await QuizsResourceAccess.customCount(filter);
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
async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let QuizsData = req.payload.data;
      let QuizId = req.payload.id;

      let updateResult = await QuizsResourceAccess.updateById(
        QuizId,
        QuizsData
      );
      if (updateResult) {
        resolve("success");
      }

      reject("failed to update category");
    } catch (e) {
      Logger.error(__filename + e);
      reject(e);
    }
  });
}
async function getDetail(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await QuizsResourceAccess.customGetDetail(
        req.query.id
        // req.query.lang
      );
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      Logger.error("get detail product error " + error);
      reject("failed");
    }
  });
}
async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        (await CommonFunctions.verifyRole(
          req.currentUser,
          STAFF_ROLE.MANAGE_STAFF
        )) == false
      ) {
        reject("NOT_ALLOWED");
        return;
      }
      let Quiz = await QuizsResourceAccess.findById(req.query.id, "id");
      if (Quiz) {
        delete Quiz.password;
        resolve(Quiz);
      }
      reject("Not found Quiz");
    } catch (e) {
      Logger.error(__filename, e);
      reject("failed");
    }
    return;
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  getList,
  getDetail,
};
