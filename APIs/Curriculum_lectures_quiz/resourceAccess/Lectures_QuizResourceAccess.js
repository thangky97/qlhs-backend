"use strict";
const { model } = require("mongoose");
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "curriculum_lectures_quizzes";

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
  const include = [
    {
      model: db.product,
      include: [{ model: db.product_name }],
    },
    {
      model: db.curriculum_sections,
    },
  ];
  return await CommonResouceFunctions.findById(tableName, key, id, include);
}
async function getMaxPriorityIndex() {
  return await db[tableName].findOne({
    attributes: [
      [db.Sequelize.fn("max", db.Sequelize.col("sort_order")), "max"],
    ],
    raw: true,
  });
}
async function customGetDetail(id, key) {
  const include = [
    {
      model: db.product,
      include: [{ model: db.product_name }],
    },
    {
      model: db.curriculum_sections,
    },
  ];
  return await CommonResouceFunctions.findById(tableName, key, id, include);
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
  if (filter.contenttext) {
    query.contenttext = {
      [db.Sequelize.Op.like]: `%${filter.contenttext}%`,
    };
  }
  if (filter.lang) {
    query.lang = {
      [db.Sequelize.Op.like]: `%${filter.lang}%`,
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
        include: [{ model: db.product_name }],
      },
      {
        model: db.curriculum_sections,
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
