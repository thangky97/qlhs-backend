'use strict'
const CommonResouceFunctions = require('../../Common/resourceAccess/QTrafficCommonResourceAccess');

const tableName = 'm_intersection';

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(tableName, id, data);
}

async function find(filter, skip, limit, order) {
  return await CommonResouceFunctions.find(tableName, filter, skip, limit, order);
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

module.exports = {
  find,
  findById,
  deleteById,
  count,
  updateById,
  insert
}