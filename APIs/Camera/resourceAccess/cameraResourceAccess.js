'use strict'
const { Op } = require('sequelize');
// const db = require('../../../models/qtraffic');
const db = require("../../../models");
const CommonResouceFunctions = require('../../Common/resourceAccess/QTrafficCommonResourceAccess');

const tableName = 'm_camera';

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(tableName, id, data, 'Camera_ID');
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

async function customFind(filter, skip, limit) {
  filter.is_deleted = 0;
  return await db.m_camera.findAll({
    where: filter,
    offset: skip,
    limit: limit,
    raw: true
  })
}

async function customCount(filter) {
  return await db.m_camera.count({
    where: filter
  });
}

async function updateAfterDeleteIntersection(intersection_id) {
  return await db.m_camera.destroy({
    where: {
      Intersection_ID: intersection_id
    }
  })
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
  updateAfterDeleteIntersection
}