"use strict";
const db = require("../../../../models");
const CommonResouceFunctions = require("../../../Common/resourceAccess/CommonResourceAccess");

const tableName = "slide";

async function findAll(filter) {
  return await CommonResouceFunctions.findAll(tableName, filter, ['priority_index', 'ASC']);
}

async function find(filter) {
  return await CommonResouceFunctions.find(tableName, filter, undefined, undefined, ['priority_index', 'ASC']);
}

async function findById(id) {
  return await CommonResouceFunctions.findById(tableName, 'id', id);
}

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(tableName, id, data);
}


async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}

async function getMaxPriorityIndex(filter) {
  return await db.slide.findOne({
    where: {
      ...filter
    },
    attributes: [[db.Sequelize.fn('max', db.Sequelize.col('priority_index')), 'max']],
    raw: true
  });
}

async function checkExistingIndex(filter, index) {
  return await db.slide.findOne({
    where: {
      ...filter,
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
  updateById,
  findById,
  getMaxPriorityIndex,
  checkExistingIndex
};
