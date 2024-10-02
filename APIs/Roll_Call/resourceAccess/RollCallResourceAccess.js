"use strict";
const db = require("../../../models");
const CommonResouceFunctions = require("../../Common/resourceAccess/CommonResourceAccess");

const tableName = "roll_call";

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
      model: db.curriculum_sections,
      include: [
        {
          model: db.product,
          required: false,
          include: [
            {
              model: db.product_name,
              required: false,
            },
          ],
        },
      ],
    },
  ];
  return await CommonResouceFunctions.findById(tableName, key, id, include);
}
async function customGetDetail(id, key) {
  return await CommonResouceFunctions.findById(tableName, key, id);
}
async function count(filter, order) {
  return await CommonResouceFunctions.count(tableName, filter, order);
}

async function deleteById(id) {
  return await CommonResouceFunctions.deleteById(tableName, id);
}
async function customCount(filter) {
  return await db[tableName].count({
    where: { ...filter },
  });
}
async function customFind(filter, skip, limit, order) {
  let query = filter;
  // if (filter.name) {
  //   query.name = {
  //     [db.Sequelize.Op.like]: `%${filter.name}%`,
  //   };
  // }

  return await db[tableName].findAll({
    limit: limit,
    offset: skip,
    order: order.map((item) => {
      return [item.key, item.value];
    }),
    where: query,
    // raw: true,
    include: [
      {
        model: db.staff,
      },
      {
        model: db.curriculum_sections,
        include: [
          {
            model: db.product,
            required: false,
            include: [
              {
                model: db.product_name,
                required: false,
              },
            ],
          },
        ],
      },
    ],
  });
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
  customGetDetail,
};
