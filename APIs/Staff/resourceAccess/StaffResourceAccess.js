"use strict";
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "staff";

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

async function customFind(filter, skip, limit, order) {
  let query = filter;
  if (filter.phone) {
    query.phone = {
      [db.Sequelize.Op.like]: `%${filter.phone}%`,
    };
  }
  if (filter.email) {
    query.email = {
      [db.Sequelize.Op.like]: `%${filter.email}%`,
    };
  }
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

  const queryFindAll = limit
    ? {
        limit: limit,
      }
    : {};

  return await db[tableName].findAll({
    ...queryFindAll,
    offset: skip,
    order: [order],
    where: query,
    raw: true,
  });
}

module.exports = {
  find,
  findById,
  deleteById,
  count,
  updateById,
  insert,
  customFind,
};
