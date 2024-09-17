"use strict";
const db = require("../../../../models");
const CommonResouceFunctions = require("../../../Common/resourceAccess/CommonResourceAccess");

const tableName = "partner";

async function findAll() {
  return await CommonResouceFunctions.findAll(tableName, {},
    ['priority_index', 'ASC']
  );
}

async function find(data) {
  return await CommonResouceFunctions.find(tableName, data);
}

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(tableName, id, data);
}

async function findById(id) {
  return await CommonResouceFunctions.findById(tableName, "id", id);
}

async function customFind(filter, skip, limit) {
  return await db.partner.findAll({
    where: filter,
    offset: skip,
    limit: limit,
    raw: true,
    order: [
      ['priority_index', 'DESC']
    ]
  })
}
async function customCount(filter) {
  return await db.partner.count({
    where: filter
  });
}

async function getMaxPriorityIndex() {
  return await db.partner.findOne({
    attributes: [[db.Sequelize.fn('max', db.Sequelize.col('priority_index')), 'max']],
    raw: true
  });
}

async function checkExistingIndex(index) {
  return await db.partner.findOne({
    where: {
      priority_index: index
    },
    raw: true
  });
}

module.exports = {
  findAll,
  find,
  insert,
  deleteById,
  customFind,
  customCount,
  updateById,
  findById,
  getMaxPriorityIndex,
  checkExistingIndex
};
