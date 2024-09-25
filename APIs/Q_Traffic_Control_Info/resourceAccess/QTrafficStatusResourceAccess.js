"use strict";
const CommonResouceFunctions = require("../../Common/resourceAccess/QTrafficCommonResourceAccess");
const { Op } = require("sequelize");
const Logger = require("../../../utils/logging");
const tableName = "t_traffic_status";
const DB = require("../../../models");

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
  data.DateTime = new Date().toISOString();
  try {
    result = await DB[tableName].findOne({
      where: {
        Intersection_ID: data.Intersection_ID,
        Edge_ID: data.Edge_ID,
      },
      raw: true,
    });

    if (result) {
      await DB[tableName].update(data, {
        where: {
          ID: result.ID,
        },
      });
      console.log("update");
    } else {
      console.log("insert");

      result = await DB[tableName].create(data);
    }

    await DB.t_traffic_status_history.create(data);
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
async function customFind(filter, limit, skip, startDate, endDate) {
  let queryBuilder = await DB[tableName].findAll({
    offset: skip,
    limit: limit,
    where: {
      Intersection_ID: filter.Intersection_ID,
      DateTime: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  return queryBuilder;
}

async function FindHistoryOutput(filter, limit = 8, skip, startDate, endDate) {
  let queryBuilder = await DB.t_traffic_status_history.findAll({
    limit: limit,
    offset: skip,
    where: {
      ...filter,
      DateTime: {
        [Op.between]: [startDate, endDate],
      },
    },
  });
  return queryBuilder;
}

async function countHistoryOutput(filter, startDate, endDate) {
  let queryBuilder = await DB.t_traffic_status_history.count({
    where: {
      ...filter,
      DateTime: {
        [Op.between]: [startDate, endDate],
      },
    },
  });
  return queryBuilder;
}

async function customeCount(filter, startDate, endDate) {
  let queryBuilder = await DB[tableName].count({
    where: {
      Intersection_ID: filter.Intersection_ID,
      DateTime: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  return queryBuilder;
}

async function findAll(filter) {
  let queryBuilder = await DB[tableName].findAll({
    where: {
      Intersection_ID: filter.Intersection_ID,
      DateTime: {
        [Op.between]: [filter.startDate, filter.endDate],
      },
    },
    raw: true,
  });

  return queryBuilder;
}

module.exports = {
  find,
  findById,
  deleteById,
  count,
  updateById,
  insert,
  customFind,
  customInsert,
  FindHistoryOutput,
  findAll,
  customeCount,
  countHistoryOutput,
};
