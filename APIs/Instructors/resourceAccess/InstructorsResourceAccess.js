"use strict";
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "instructors";

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
  if (filter.first_name) {
    query.first_name = {
      [db.Sequelize.Op.like]: `%${filter.first_name}%`,
    };
  }

  if (filter.last_name) {
    query.last_name = {
      [db.Sequelize.Op.like]: `%${filter.last_name}%`,
    };
  }

  if (filter.contact_email) {
    query.contact_email = {
      [db.Sequelize.Op.like]: `%${filter.contact_email}%`,
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
    raw: true,
  });
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
};
