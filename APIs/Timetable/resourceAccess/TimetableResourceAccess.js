"use strict";
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "timetable";

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
      model: db.staff,
      required: false,
    },
    {
      model: db.course,
      required: false,
    },
    {
      model: db.classroom,
      required: false,
    },
    {
      model: db.semester,
      required: false,
    },
    {
      model: db.curriculum_sections,
      required: false,
    },
  ];
  return await CommonResouceFunctions.findById(tableName, key, id, include);
}

async function count(filter, order) {
  return await CommonResouceFunctions.count(tableName, filter, order);
}

async function customCount(filter) {
  return await db[tableName].count({
    where: { ...filter },
  });
}

async function customFind(filter, skip, limit, order) {
  let query = filter;

  if (filter.name) {
    query.name = {
      [db.Sequelize.Op.like]: `%${filter.name}%`,
    };
  }

  return await db[tableName].findAll({
    limit: limit,
    offset: skip,
    order: order.map((item) => {
      return [item.key, item.value];
    }),
    where: query,
    include: [
      {
        model: db.staff,
        required: false,
      },
      {
        model: db.course,
        required: false,
      },
      {
        model: db.classroom,
        required: false,
      },
      {
        model: db.semester,
        required: false,
      },
      {
        model: db.curriculum_sections,
        required: false,
      },
    ],
  });
}

module.exports = {
  find,
  findById,
  count,
  updateById,
  insert,
  customFind,
  customCount,
};
