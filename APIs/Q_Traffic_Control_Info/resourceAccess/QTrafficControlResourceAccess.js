"use strict";
const CommonResouceFunctions = require("../../Common/resourceAccess/QTrafficCommonResourceAccess");
const Logger = require("../../../utils/logging");
const { Op } = require("sequelize");
const tableName = "t_q_traffic_control_info";
const moment = require("moment");
const DB = require("../../../models");
var socketio = require("./../../../server");

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

async function customFind(functionName, filter, skip, limit) {
  let filterParams = {};
  filterParams.is_deleted = 0;
  if (filter?.Intersection_Name?.trim()) {
    filterParams.Intersection_Name = {
      [DB.Sequelize.Op.like]: `%${filter.Intersection_Name}%`,
    };
  }

  let queryBuilder = await DB[tableName][functionName]({
    offset: skip,
    limit: limit,
    where: {
      User_ID: filter.User_ID,
      // DateTime: {
      //   [Op.between]:[moment().subtract(1, 'days').toDate().toISOString(),new Date().toISOString()]
      // }
    },
    order: [["DateTime", "DESC"]],
    include: [
      {
        model: DB.m_intersection,
        required: true,
        where: filterParams,
      },
    ],
  });

  return queryBuilder;
}

async function customCount(filter) {
  let filterParams = {};
  filterParams.is_deleted = 0;
  if (filter?.Intersection_Name?.trim()) {
    filterParams.Intersection_Name = {
      [DB.Sequelize.Op.like]: `%${filter.Intersection_Name}%`,
    };
  }

  let queryBuilder = await DB[tableName].count({
    where: {
      User_ID: filter.User_ID,
    },
    order: [["DateTime", "DESC"]],
    include: [
      {
        model: DB.m_intersection,
        required: true,
        where: filterParams,
      },
    ],
  });

  return queryBuilder;
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

    await DB.t_q_traffic_control_info_history.create(data);
    socketio.sockets.emit("update", result);

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
async function FindHistoryOutput(filter, limit = 8, skip, startDate, endDate) {
  let queryBuilder = await DB.t_q_traffic_control_info_history.findAll({
    limit: limit,
    offset: skip,
    where: {
      ...filter,
      DateTime: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [["DateTime", "DESC"]],
  });
  return queryBuilder;
}

async function countHistoryOutput(filter, startDate, endDate) {
  let queryBuilder = await DB.t_q_traffic_control_info_history.count({
    where: {
      ...filter,
      DateTime: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [["DateTime", "DESC"]],
  });
  return queryBuilder;
}
module.exports = {
  find,
  findById,
  deleteById,
  count,
  customInsert,
  updateById,
  insert,
  customFind,
  FindHistoryOutput,
  countHistoryOutput,
  customCount,
};
