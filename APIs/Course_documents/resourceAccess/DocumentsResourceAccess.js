"use strict";
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "course_documents";

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
async function getMaxPriorityIndex() {
  return await db[tableName].findOne({
    attributes: [
      [db.Sequelize.fn("max", db.Sequelize.col("sort_order")), "max"],
    ],
    raw: true,
  });
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

async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
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
  if (filter.lang) {
    query.lang = {
      [db.Sequelize.Op.like]: `%${filter.lang}%`,
    };
  }
  if (filter.author) {
    query.author = {
      [db.Sequelize.Op.like]: `%${filter.author}%`,
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
      {
        model: db.product,
        include: [
          {
            model: db.product_name,
          },
        ],
      },
    ],
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
  customCount,
  customGetDetail,
  getMaxPriorityIndex,
};
