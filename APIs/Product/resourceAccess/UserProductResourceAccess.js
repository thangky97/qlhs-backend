'use strict'
const CommonResouceFunctions = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = 'user_product';


async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function updateById(id, data, key) {
  return await CommonResouceFunctions.updateById(tableName, id, data, key);
}

async function find(filter, skip, limit, order, searchText) {
  return await CommonResouceFunctions.find(tableName, filter, skip, limit, order, searchText);
}

async function findById(id, key) {
  return await CommonResouceFunctions.findById(tableName, key, id);
}

async function count(filter, order, searchText) {
  return await CommonResouceFunctions.count(tableName, filter, order, searchText);
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