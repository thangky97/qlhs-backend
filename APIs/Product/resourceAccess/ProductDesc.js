'use strict'
const CommonResouceFunctions = require('../../Common/resourceAccess/CommonResourceAccess');
const DB = require('../../../models');
const tableName = 'product_description';

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


async function findAll(orderBy) {
  return await DB[tableName].findAll({ orderBy, raw: true });
}

async function findAndUpdate(filter, updateData) {
  let data = await find(filter);
 
  if (data && data.length > 0) {
    return await updateById(data[0].id, updateData);
  } else {
    return await insert({
      ...updateData,
      ...filter,
    });
  }
}

async function customDelete(filter) {
  return new Promise(async (resolve, reject) => {
    try {
      DB[tableName].destroy({
        where: filter
      }).then(() => {
        resolve('ok');
      }).catch(err => {
        Logger.error("delete many error " + error);
        reject(err);
      });
    } catch (error) {
      Logger.error("delete many error " + error);
      reject(error);
    }
  })
}

async function customFind(filter, skip, limit, orderBy, searchText) {
  return await _makeQueryBuilderByFilter('findAll', filter, skip, limit, orderBy, searchText);
}

async function customCount(filter, skip, limit, orderBy, searchText) {
  return await _makeQueryBuilderByFilter('count', filter, skip, limit, orderBy, searchText);
}

async function _makeQueryBuilderByFilter(
  functionName, filter = {}, skip = 0, limit = 20,
  orderBy = ['id', 'DESC'], searchText
) {
  if (searchText) {
    filter = {
      ...filter,
      name: {
        [Op.like]: `%${searchText}%`
      },
      code: {
        [Op.like]: `%${searchText}%`
      }
    }
  }
  let queryBuilder = await DB[tableName][functionName]({
    where: {
      ...filter,

    },
    offset: skip, limit: limit,
    order: [orderBy]
  });

  return queryBuilder;
}

async function bulkInsert(data) {
  return await CommonResouceFunctions.bulkInsert(tableName, data);
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
  findAll,
  findAndUpdate,
  customDelete,
  bulkInsert
}