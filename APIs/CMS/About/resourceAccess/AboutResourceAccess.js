"use strict";
const CommonResouceFunctions = require("../../../Common/resourceAccess/CommonResourceAccess");

const tableName = "about";

async function findAll(filter) {
  return await CommonResouceFunctions.findAll(tableName, filter);
}

async function find(filter) {
  return await CommonResouceFunctions.find(tableName, filter);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(tableName, id, data);
}

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}
async function insert_user_token(data) {
  return await CommonResouceFunctions.insert("user_tokens", data);
}

async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}

async function findById(id) {
  return await CommonResouceFunctions.findById(tableName, "id", id);
}

module.exports = {
  findAll,
  updateById,
  insert_user_token,
  insert,
  deleteById,
  findById,
  find,
};
