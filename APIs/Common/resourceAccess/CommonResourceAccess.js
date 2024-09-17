"use strict";
require("dotenv").config();

const Logger = require("../../../utils/logging");
const DB = require("../../../models");

if (process.env.REDIS_ENABLE) {
  const cache = require("../../../ThirdParty/Redis/RedisInstance");
  cache.initRedis();
}

async function insert(tableName, data) {
  console.log(tableName, data, "-tableName, data");
  let result = undefined;
  try {
    result = await DB[tableName].create(data);
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

async function updateById(tableName, id, data, key = "id") {
  let result = undefined;
  try {
    result = await findById(tableName, key, id, false);
    if (result) {
      await result.update(data);
      await result.save();
    }
    //enable redis cache
    if (process.env.REDIS_ENABLE) {
      if (result) {
        var keys = Object.keys(id);
        let idValue = id[keys[0]];
        let dataUpdate = await DB[tableName].select().where(id);
        await cache.deleteByKey(`${tableName}_${idValue.toString()}`);
        await cache.setWithExpire(
          `${tableName}_${idValue.toString()}`,
          JSON.stringify(dataUpdate[0])
        );
      }
    }
  } catch (e) {
    Logger.error(
      "ResourceAccess",
      `DB UPDATEBYID ERROR: ${tableName} : ${id} - ${JSON.stringify(data)}`
    );
    Logger.error("ResourceAccess", e);
  }
  return result;
}

async function updateByCode(tableName, code, data, codeColumn = "code") {
  let result = undefined;
  try {
    result = await findByCode(tableName, codeColumn, code);
    console.log("dây result", result);
    for (let i = 0; i < result.length; i++) {
      await result[i].update(data);
      await result[i].save();
    }
    // enable redis cache
    if (process.env.REDIS_ENABLE) {
      if (result.length > 0) {
        let codeValue = code.toString();
        let dataUpdate = await DB[tableName].select().where(codeColumn, code);
        for (let i = 0; i < result.length; i++) {
          await cache.deleteByKey(`${tableName}_${codeValue}`);
          await cache.setWithExpire(
            `${tableName}_${codeValue}`,
            JSON.stringify(dataUpdate[i])
          );
        }
      }
    }
  } catch (e) {
    Logger.error(
      "ResourceAccess",
      `DB UPDATEBYCODE ERROR: ${tableName} : ${code} - ${JSON.stringify(data)}`
    );
    Logger.error("ResourceAccess", e);
  }
  return result;
}

async function find(tableName, filter, skip = 0, limit = 20, order) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await _makeQueryBuilderByFilter(
        tableName,
        "findAll",
        filter,
        skip,
        limit,
        order
      );
      if (data) resolve(data);
      resolve([]);
    } catch (e) {
      console.log(e);
      Logger.error(
        `ResourceAccess DB FIND ERROR: ${tableName} : ${JSON.stringify(
          filter
        )} - ${skip} - ${limit} ${JSON.stringify(order)}`
      );
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

async function findById(tableName, key, id, include, raw = true, nest = true) {
  let result = undefined;
  //enable redis cache
  if (process.env.REDIS_ENABLE) {
    result = await cache.getJson(`${tableName}_${id}`);
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (result) {
        resolve(result);
      } else {
        DB[tableName]
          .findOne({
            where: {
              id,
            },
            // raw,
            nest,
            include,
          })
          .then((records) => {
            if (records) {
              resolve(records);
            } else {
              resolve(undefined);
            }
          })
          .catch((e) => {
            console.log("eeee", e);
          });
      }
    } catch (e) {
      Logger.error(
        "ResourceAccess",
        `DB FIND ERROR: findOne ${tableName} : ${key} - ${id}`
      );
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

async function findByCode(
  tableName,
  key,
  code,
  include,
  raw = true,
  nest = true
) {
  let result = undefined;
  //enable redis cache
  if (process.env.REDIS_ENABLE) {
    result = await cache.getJson(`${tableName}_${code}`);
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (result) {
        resolve(result);
      } else {
        DB[tableName]
          .findAll({
            where: {
              code,
            },
            // raw,
            nest,
            include,
          })
          .then((records) => {
            if (records) {
              resolve(records);
            } else {
              resolve(undefined);
            }
          })
          .catch((e) => {
            console.log("eeee", e);
          });
      }
    } catch (e) {
      Logger.error(
        "ResourceAccess",
        `DB FIND ERROR: findOne ${tableName} : ${key} - ${id}`
      );
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

async function count(tableName, filter, order) {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await _makeQueryBuilderByFilter(
        tableName,
        "count",
        filter,
        undefined,
        undefined,
        order
      );
      if (count) {
        resolve(count);
      } else {
        resolve(0);
      }
    } catch (e) {
      console.log(e);
      Logger.error(
        "ResourceAccess",
        `DB COUNT ERROR: ${tableName} : ${JSON.stringify(
          filter
        )} - ${JSON.stringify(order)}`
      );
      Logger.error("ResourceAccess", e);
      reject(undefined);
    }
  });
}

async function deleteById(tableName, id) {
  let result = undefined;
  try {
    result = await DB[tableName].destroy({
      where: {
        id: id,
      },
    });
  } catch (e) {
    Logger.error("ResourceAccess", `DB DELETEBYID ERROR: ${tableName} : ${id}`);
    Logger.error("ResourceAccess", e);
  }
  return result;
}
async function deleteByCode(tableName, code) {
  let result = undefined;
  try {
    result = await DB[tableName].destroy({
      where: {
        code,
      },
    });
  } catch (e) {
    Logger.error("ResourceAccess", `DB DELETEBYID ERROR: ${tableName} : ${id}`);
    Logger.error("ResourceAccess", e);
  }
  return result;
}
async function _makeQueryBuilderByFilter(
  tableName,
  functionName,
  filter = {},
  skip = 0,
  limit = 20,
  orderBy = ["id", "DESC"]
) {
  console.log("search");
  console.log(filter);
  let queryBuilder = await DB[tableName][functionName]({
    where: filter,
    offset: skip,
    limit: limit,
    order: [orderBy],
    raw: true,
  });
  return queryBuilder;
}

async function findAll(tableName, filter = {}, orderBy = ["id", "DESC"]) {
  let queryBuilder = await DB[tableName].findAll({
    where: filter,
    order: [orderBy],
  });
  return await queryBuilder;
}

async function bulkInsert(tableName, data) {
  let result = undefined;
  try {
    result = await DB[tableName].bulkCreate(data);
  } catch (e) {
    Logger.error(
      "ResourceAccess",
      `DB INSERT ERROR: ${tableName} : ${JSON.stringify(data)}`
    );
    Logger.error("ResourceAccess", e);
  }
  return result;
}

module.exports = {
  insert,
  find,
  findById,
  findAll,
  bulkInsert,
  // findAllDelete,
  updateById,
  // updateAllById,
  updateByCode,
  count,
  // createOrReplaceView,
  // updateAll,
  // sum,
  deleteById,
  deleteByCode,
  // incrementInt,
  // decrementInt,
  // incrementFloat,
  // decrementFloat,
  // sumAmountDistinctByDate,
  // sumAmountDistinctByCustomField
};
