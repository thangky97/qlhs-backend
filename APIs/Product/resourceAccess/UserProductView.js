"use strict";
const db = require("../../../models");
const {
  viewTableName,
} = require("../../../models/transaction/user-product-view");
const moment = require("moment");

async function find(filter, limit, skip, startDate, endDate, searchText) {
  let query = _makeQueryObject(
    filter,
    limit,
    skip,
    startDate,
    endDate,
    searchText
  );
  return await db.sequelize.query(
    `SELECT * \nFROM ${viewTableName}\n${query}`,
    { raw: true, type: db.Sequelize.QueryTypes.SELECT }
  );
}

async function count(filter, startDate, endDate, searchText) {
  let query = _makeQueryObject(
    filter,
    undefined,
    undefined,
    startDate,
    endDate,
    searchText
  );
  return await db.sequelize.query(
    `SELECT COUNT(id) as count \nFROM ${viewTableName}\n${query}`,
    { raw: true, type: db.Sequelize.QueryTypes.SELECT }
  );
}

function _makeQueryObject(filter, limit, skip, startDate, endDate, searchText) {
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  let result = "";

  let arrayFilter = Object.keys(filterData);
  if (arrayFilter.length > 0) {
    result = "WHERE \n";
    for (let i = 0; i < arrayFilter.length; i++) {
      let isString = /[a-zA-Z]/g.test(filterData[arrayFilter[i]]);
      result = `${result} ${i > 0 ? "AND" : ""} ${arrayFilter[i]} = ${
        isString
          ? `'${filterData[arrayFilter[i]]}'`
          : filterData[arrayFilter[i]]
      }\n`;
    }
  }

  if (searchText) {
    let text = "WHERE";
    if (result.indexOf("WHERE") > -1) {
      text = "AND (";
    } else {
      text = "WHERE \n (";
    }
    result = `${result} ${text} username like '%${searchText}%')\n`;
  }

  if (startDate) {
    startDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    let attr = result.indexOf("WHERE") > -1 ? "AND" : "WHERE";
    result = `${result} ${attr} createdAt >= '${startDate}'\n`;
  }

  if (endDate) {
    endDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    let attr = result.indexOf("WHERE") > -1 ? "AND" : "WHERE";
    result = `${result} ${attr} createdAt <= '${endDate}'\n`;
  }

  result = `${result} order by createdAt desc\n`;

  if (limit) {
    result = `${result} limit ${limit}\n`;
  }

  if (skip) {
    result = `${result} offset ${skip}\n`;
  }

  return result;
}

async function customFind(filter, skip, limit, orderBy) {
  let query = filter;
  if (filter.lang) {
    query.lang = {
      [db.Sequelize.Op.like]: `%${filter.lang}%`,
    };
  }

  let queryBuilder = await db["users_product"].findAll({
    where: {
      ...query,
      product_type: 0,
    },
    offset: skip,
    limit: limit,
    order: orderBy.map((item) => {
      return [item.key, item.value];
    }),
    include: [
      {
        model: db["users"],
      },
      {
        model: db["transaction"],
      },
    ],
  });

  return queryBuilder;
}

async function findById(id) {
  return await db.sequelize.query(
    `SELECT * \nFROM ${viewTableName}\n WHERE id = ${id}`,
    { raw: true, type: db.Sequelize.QueryTypes.SELECT }
  );
}

module.exports = {
  find,
  count,
  findById,
  customFind,
};
