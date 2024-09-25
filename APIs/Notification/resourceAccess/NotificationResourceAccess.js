"use strict";
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "notifications";

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateByCode(tableName, id, data);
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
async function customGetDetail(id, key) {
  return await CommonResouceFunctions.findById(tableName, key, id);
}
async function userGetDetail(productId, usersId) {
  return await db[tableName].findAll({
    where: {
      productId,
      usersId,
    },
  });
}
async function count(filter, order) {
  return await CommonResouceFunctions.count(tableName, filter, order);
}

async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}
async function deleteByCode(code) {
  return await CommonResouceFunctions.deleteByCode(tableName, code);
}
async function customCount(filter) {
  return await db[tableName].count({
    where: { ...filter },
  });
}
async function customFind(filter, skip, limit, order) {
  let query = filter;
  if (filter.name) {
    query.name = {
      [db.Sequelize.Op.like]: `%${filter.name}%`,
    };
  }

  const results = await db[tableName].findAll({
    offset: skip,
    order: [order],
    where: query,
  });

  const uniqueResults = [];
  const seenCodes = new Set();

  for (let i = 0; i < results.length; i++) {
    const code = results[i].code;
    if (!seenCodes.has(code)) {
      seenCodes.add(code);
      uniqueResults.push(results[i]);
    }
  }

  return uniqueResults;
}
module.exports = {
  find,
  findById,
  deleteById,
  count,
  updateById,
  insert,
  customFind,
  customCount,
  customGetDetail,
  userGetDetail,
  deleteByCode,
};
