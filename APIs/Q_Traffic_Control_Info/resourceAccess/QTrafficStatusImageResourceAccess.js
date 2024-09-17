"use strict";
const CommonResouceFunctions = require("../../Common/resourceAccess/QTrafficCommonResourceAccess");

const DB = require("../../../models");
const Logger = require("../../../utils/logging");
const tableName = "t_q_traffic_media";

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(tableName, id, data);
}

async function find(filter, skip, limit, order) {
  return await CommonResouceFunctions.find(
    tableName,
    filter,
    skip,
    limit,
    order
  );
}

async function findById(id, key) {
  return await CommonResouceFunctions.findById(tableName, key, id);
}

async function count(filter, order) {
  return await CommonResouceFunctions.count(tableName, filter, order);
}

async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}

async function customInsert(data) {
  let result = undefined;
  console.log("customer insert");
  try {
    result = await DB[tableName].findOne({
      where: {
        Camera_ID: data.Camera_ID,
      },
      raw: true,
    });

    if (result) {
      await DB[tableName].update(data, {
        where: {
          id: result.id,
        },
      });
    } else {
      result = await DB[tableName].create(data);
    }

    await DB.t_q_traffic_media_history.create(data);
    //enable redis cache
    if (process.env.REDIS_ENABLE) {
      if (result) {
        let id = result[0];
        let dataTable = await find(tableName, undefined, 0, 1);
        let dataCache = dataTable[0];
        await cache.setWithExpire(
          `${tableName}_${id.toString()}`,
          JSON.stringify(dataCache)
        );
      }
    }
  } catch (e) {
    Logger.error(
      "ResourceAccess",
      `DB INSERT ERROR: ${tableName} : ${JSON.stringify(data)}`
    );
    Logger.error("ResourceAccess", e);
  }

  return result;
}
async function customFind(functionName, filter, limit = 8, skip) {
  let filtereParams = {
    where: {
      Intersection_ID: filter.Intersection_ID,
    },
  };
  if (functionName === "findAll") {
    filtereParams.offset = skip;
    filtereParams.limit = limit;
  }
  let queryBuilder = await DB[tableName][functionName](filtereParams);

  return queryBuilder;
}
async function FindHistoryInput(functionName, filter, limit = 8, skip) {
  let filtereParams = {
    where: {
      Camera_ID: filter.Camera_ID,
    },
  };
  if (functionName === "findAll") {
    filtereParams.offset = skip;
    filtereParams.limit = limit;
  }
  let queryBuilder = await DB.t_q_traffic_media_history[functionName](filtereParams);

  return queryBuilder;
}


module.exports = {
  find,
  findById,FindHistoryInput,
  deleteById,
  count,
  updateById,
  customInsert,
  insert,
  customFind,
};
