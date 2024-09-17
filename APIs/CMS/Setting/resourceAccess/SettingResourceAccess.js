"use strict";
const CommonResouceFunctions = require("../../../Common/resourceAccess/CommonResourceAccess");

const tableName = "setting";

async function findAll() {
  return await CommonResouceFunctions.findAll(tableName);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(tableName, id, data);
}

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}
module.exports = {
  findAll,
  updateById,
  insert,
  deleteById,
};
