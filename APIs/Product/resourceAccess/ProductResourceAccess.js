"use strict";
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");
const DB = require("../../../models");
const tableName = "product";
const { Op } = require("sequelize");
const db = require("../../../models");

async function insert(data) {
  return await CommonResouceFunctions.insert(tableName, data);
}

async function updateById(id, data) {
  return await CommonResouceFunctions.updateById(tableName, id, data);
}

async function find(filter, skip, limit, order, searchText) {
  return await CommonResouceFunctions.find(
    tableName,
    filter,
    skip,
    limit,
    order,
    searchText
  );
}

async function findById(id, key) {
  return await CommonResouceFunctions.findById(tableName, key, id);
}

async function count(filter, order, searchText) {
  return await CommonResouceFunctions.count(
    tableName,
    filter,
    order,
    searchText
  );
}

async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}

async function findAll(orderBy) {
  return await DB[tableName].findAll({ orderBy, raw: true });
}

async function customFind(filter, skip, limit, orderBy, searchText) {
  let joinQueryLang = {};
  let joinQuerySearchText = {};
  let joinQueryService = {};
  if (searchText) {
    joinQuerySearchText = {
      name: {
        [Op.like]: `%${searchText}%`,
      },
    };
  }
  if (filter.lang) {
    joinQueryLang.lang = filter.lang;
  }
  if (filter.service_type) {
    joinQueryService.service = filter.service_type;
  }
  delete filter.service_type;
  // delete filter.lang;

  let queryBuilder = await DB[tableName].findAll({
    where: {
      ...filter,
      is_deleted: 0,
    },
    offset: skip,
    limit: limit,
    order: orderBy.map((item) => {
      return [item.key, item.value];
    }),
    include: [
      {
        model: DB["product_name"],
        where: {
          ...joinQuerySearchText,
        },
      },
      {
        model: DB["product_description"],

        where: { ...joinQueryLang },
        required: false,
      },
      {
        model: db.department,
        required: true,
        include: [
          {
            model: db.training_programs,
            required: true,
          },
        ],
      },
    ],
  });

  return queryBuilder;
}

async function customCount(filter) {
  let query = filter;

  if (filter.lang) {
    query.lang = {
      [db.Sequelize.Op.like]: `%${filter.lang}%`,
    };
  }
  return await DB[tableName].count({
    where: { ...query, is_deleted: 0 },
  });
}
async function customCount(filter) {
  return await DB[tableName].count({
    where: { ...filter, is_deleted: 0 },
  });
}

async function customGetDetailuser(id, lang) {
  return await DB[tableName].findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: DB["product_name"],
        required: false,
      },
      {
        model: DB["product_description"],
        required: false,
        where: { lang: lang },
      },
    ],
  });
}

async function customGetScores(id) {
  return await DB[tableName].findOne({
    where: {
      id: id,
    },
  });
}

async function customGetDetail(id, lang) {
  return await DB[tableName].findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: DB["product_name"],
        required: false,
      },
      {
        model: DB["product_description"],
        required: false,
        where: { lang: lang },
      },
      {
        model: DB["curriculum_sections"],
        as: "sections",
        where: { lang: lang },
        required: false,
        include: [
          // {
          //   model: DB.course,
          //   as: "course",
          // },
          {
            model: DB.staff,
          },
        ],
      },
      {
        model: DB.department,
        required: false,
      },
    ],
  });
}
async function userGetProductDetail(id, lang) {
  return await DB[tableName].findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: DB["product_name"],
        required: false,
      },
      {
        model: DB["product_description"],
        required: false,
        where: { lang: lang },
      },
    ],
  });
}
async function customGetDetailusercourse(id, lang, usersId) {
  return await DB[tableName].findOne({
    where: {
      id: id,
    },
  });
}

async function customGetDetailcourse(id, lang, usersId) {
  return await DB[tableName].findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: DB["product_name"],
        required: false,
      },
      {
        model: DB["product_description"],
        required: false,
        where: { lang: lang },
      },
    ],
  });
}

async function getMaxPriorityIndex() {
  return await db[tableName].findOne({
    attributes: [
      [db.Sequelize.fn("max", db.Sequelize.col("priority_index")), "max"],
    ],
    raw: true,
  });
}

async function checkExistingIndex(index) {
  return await db[tableName].findOne({
    where: {
      priority_index: index,
      is_deleted: 0,
    },
    raw: true,
  });
}

module.exports = {
  find,
  findById,
  deleteById,
  count,
  updateById,
  insert,
  customGetDetailuser,
  customFind,
  customCount,
  findAll,
  customGetDetail,
  getMaxPriorityIndex,
  checkExistingIndex,
  customGetDetailusercourse,
  customGetDetail,
  customGetDetailcourse,
  userGetProductDetail,
  customGetScores,
};
