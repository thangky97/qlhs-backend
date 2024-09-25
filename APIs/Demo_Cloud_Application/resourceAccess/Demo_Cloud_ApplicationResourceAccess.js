"use strict";
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "democloudapplications";

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
async function getMaxPriorityIndex() {
  return await db[tableName].findOne({
    attributes: [
      [db.Sequelize.fn("max", db.Sequelize.col("priority_index")), "max"],
    ],
    raw: true,
  });
}
async function customGetDetail(id, key) {
  return await CommonResouceFunctions.findById(tableName, key, id);
}
async function count(filter, order) {
  return await CommonResouceFunctions.count(tableName, filter, order);
}

async function customCount(filter) {
  return await db[tableName].count({
    where: { ...filter },
  });
}
async function customFind(filter, skip, limit, order) {
  let query = filter;
  if (filter.lang) {
    query.lang = {
      [db.Sequelize.Op.like]: `%${filter.lang}%`,
    };
  }

  return await db[tableName].findAll({
    limit: limit,
    offset: skip,
    order: order.map((item) => {
      return [item.key, item.value];
    }),
    where: query,
  });
}
async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}

module.exports = {
  find,
  findById,
  count,
  updateById,
  insert,
  customFind,
  customCount,
  customGetDetail,
  deleteById,
  getMaxPriorityIndex,
};
