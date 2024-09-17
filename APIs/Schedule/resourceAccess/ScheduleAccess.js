"use strict";
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "schedule";

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
  const include = { all: true };
  return await CommonResouceFunctions.findById(tableName, key, id, include);
}
async function customGetDetail(id, key) {
  const include = { all: true };
  return await CommonResouceFunctions.findById(tableName, key, id, include);
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
  if (filter.room) {
    query.room = {
      [db.Sequelize.Op.like]: `%${filter.room}%`,
    };
  }
  if (filter.lang) {
    query.lang = {
      [db.Sequelize.Op.like]: `%${filter.lang}%`,
    };
  }
  if (filter.class) {
    query.class = {
      [db.Sequelize.Op.like]: `%${filter.class}%`,
    };
  }
  if (filter.date) {
    query.date = {
      [db.Sequelize.Op.like]: `%${filter.date}%`,
    };
  }

  const queryFindAll = limit
    ? {
        limit: limit,
      }
    : {};

  return await db[tableName].findAll({
    ...queryFindAll,
    offset: skip,
    order: order.map((item) => {
      return [item.key, item.value];
    }),
    where: query,
    include: [
      { all: true },
      {
        model: db.curriculum_sections,
      },
    ],
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
};
