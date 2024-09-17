"use strict";
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "user_quizs";

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
      model: db.curriculum_lectures_quizzes,
      as: "lectures_quizs",
    },
  ];
  return await CommonResouceFunctions.findById(tableName, key, id, include);
}
async function customGetDetail(id, key) {
  const include = [
    // {
    //   model: db.product,
    //   as: "products",
    // },
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
  // if (filter.name) {
  //   query.name = {
  //     [db.Sequelize.Op.like]: `%${filter.name}%`,
  //   };
  // }

  return await db[tableName].findAll({
    limit: limit,
    offset: skip,
    order: order.map((item) => {
      return [item.key, item.value];
    }),
    where: query,
    // raw: true,
    // include: [
    //   {
    //     model: db.product,
    //     as: "product",
    //   },
    // ],
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
};
