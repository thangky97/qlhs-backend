"use strict";
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");
const DB = require("../../../models");

const tableName = "users";

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(tableName, id, data);
}

async function updateUserToken(id, data) {
  return await CommonResouceFunctions.updateById("user_tokens", id, data);
}

async function find(filter, skip, limit, order) {
  const query = limit
    ? [tableName, filter, limit, skip, order]
    : [tableName, filter, skip, order];

  return await CommonResouceFunctions.find(...query);
}

async function findUserToken(
  filter,
  first_name,
  last_name,
  skip,
  limit,
  order
) {
  let query = filter;

  const queryFindAll = limit
    ? {
        limit: limit,
      }
    : {};

  const queryNameUser = {};
  if (first_name) {
    queryNameUser.first_name = {
      [DB.Sequelize.Op.like]: `%${first_name}%`,
    };
  }

  if (last_name) {
    queryNameUser.last_name = {
      [DB.Sequelize.Op.like]: `%${last_name}%`,
    };
  }

  return await DB.user_tokens.findAll({
    ...queryFindAll,
    offset: skip,
    order: order.map((item) => {
      return [item.key, item.value];
    }),
    where: query,
  });
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

async function customFind(filter, skip, limit, orderBy) {
  let query = filter;
  let usersType = {};

  if (filter.phone) {
    query.phone = {
      [DB.Sequelize.Op.like]: `%${filter.phone}%`,
    };
  }
  if (filter.email) {
    query.email = {
      [DB.Sequelize.Op.like]: `%${filter.email}%`,
    };
  }
  if (filter.username) {
    query.username = {
      [DB.Sequelize.Op.like]: `%${filter.username}%`,
    };
  }

  if (filter.first_name) {
    query.first_name = {
      [DB.Sequelize.Op.like]: `%${filter.first_name}%`,
    };
  }

  if (filter.last_name) {
    query.last_name = {
      [DB.Sequelize.Op.like]: `%${filter.last_name}%`,
    };
  }

  let queryBuilder = await DB[tableName].findAll({
    where: query,
    offset: skip,
    limit: limit,
    order: [orderBy],
  });

  return queryBuilder;
}

async function customCount(filter) {
  let queryBuilder = await DB[tableName].count({
    where: {
      ...filter,
    },
  });

  return queryBuilder;
}

async function customUserTokenCount(filter) {
  let queryBuilder = await DB.user_tokens.count({
    where: {
      ...filter,
    },
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
  customCount,
  customFind,
  updateUserToken,
  customUserTokenCount,
  findUserToken,
};
