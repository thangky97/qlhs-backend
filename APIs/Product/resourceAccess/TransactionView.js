"use strict";
const db = require("../../../models");
const {
  viewTableName,
} = require("../../../models/transaction/transaction-view");
const moment = require("moment");
const { Op } = require("sequelize");

async function find(
  filter,
  limit,
  skip,
  startDate,
  endDate,
  order,
  searchUser
) {
  let query = _makeQueryObject(
    filter,
    limit,
    skip,
    startDate,
    endDate,
    order,
    searchUser
  );

  if (startDate && endDate) {
    filter.updatedAt = {
      [Op.and]: [
        { [Op.gte]: Date.parse(startDate) },
        { [Op.lte]: Date.parse(endDate) },
      ],
    };
  } else if (startDate) {
    filter.updatedAt = {
      [Op.gte]: Date.parse(startDate),
    };
  } else if (endDate) {
    filter.updatedAt = {
      [Op.lte]: Date.parse(endDate),
    };
  }

  let queryString = {
    where: filter,
  };

  if (limit) queryString.limit = limit;
  if (skip) queryString.offset = skip;
  if (filter.user_payment) {
    filter.user_payment = {
      [db.Sequelize.Op.like]: `%${filter.user_payment}%`,
    };
  }
  if (filter.lang) {
    filter.lang = {
      [db.Sequelize.Op.like]: `%${filter.lang}%`,
    };
  }

  const result = await db.transaction.findAll({
    ...queryString,
    order: order ? [[order.key, order.value]] : [],
    include: [
      {
        model: db.users_product,
        as: "user_product",
        include: [
          {
            model: db.users,
            as: "user",
          },
        ],
      },
    ],
    type: db.Sequelize.QueryTypes.SELECT,
  });

  return result;
}

async function findToken(filter, limit, skip, startDate, endDate, searchUser) {
  let query = _makeQueryObject(
    filter,
    limit,
    skip,
    startDate,
    endDate,
    searchUser
  );

  if (startDate && endDate) {
    filter.updatedAt = {
      [Op.and]: [
        { [Op.gte]: Date.parse(startDate) },
        { [Op.lte]: Date.parse(endDate) },
      ],
    };
  } else if (startDate) {
    filter.updatedAt = {
      [Op.gte]: Date.parse(startDate),
    };
  } else if (endDate) {
    filter.updatedAt = {
      [Op.lte]: Date.parse(endDate),
    };
  }

  let queryString = {
    where: filter,
  };

  if (limit) queryString.limit = limit;
  if (skip) queryString.offset = skip;
  if (filter.user_payment) {
    filter.user_payment = {
      [db.Sequelize.Op.like]: `%${filter.user_payment}%`,
    };
  }
  if (filter.lang) {
    filter.lang = {
      [db.Sequelize.Op.like]: `%${filter.lang}%`,
    };
  }

  const result = await db.transaction.findAll({
    ...queryString,
    include: [
      {
        model: db.userTokenDetails,
        as: "userTokenDetails",
        include: [
          {
            model: db.user_tokens,
            required: false,
            include: [
              {
                model: db.product,
                required: false,
                include: [
                  {
                    model: db.product_name,
                    as: "product_names",
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    type: db.Sequelize.QueryTypes.SELECT,
  });

  return result;
}

async function count(filter, startDate, endDate, searchUser) {
  let query = _makeQueryObject(
    filter,
    undefined,
    undefined,
    startDate,
    endDate,
    searchUser
  );
  return await db.sequelize.query(
    `SELECT COUNT(id) as count \nFROM ${viewTableName}\n${query}`,
    { raw: true, type: db.Sequelize.QueryTypes.SELECT }
  );
}

function _makeQueryObject(filter, limit, skip, startDate, endDate, searchUser) {
  let filterData = filter ? JSON.parse(JSON.stringify(filter)) : {};
  let result = "";

  let arrayFilter = Object.keys(filterData);
  if (arrayFilter.length > 0) {
    result = "WHERE \n";
    for (let i = 0; i < arrayFilter.length; i++) {
      let isString = /[a-zA-Z]/g.test(filterData[arrayFilter[i]]);
      result = `${result}  ${i > 0 ? "AND" : ""} ${arrayFilter[i]} = ${
        isString
          ? `'${filterData[arrayFilter[i]]}'`
          : filterData[arrayFilter[i]]
      }\n`;
    }
  }

  if (searchUser) {
    let text = "WHERE";
    if (result.indexOf("WHERE") > -1) {
      text = "AND (";
    } else {
      text = "WHERE \n (";
    }
    result = `${result} ${text} username like '%${searchUser}%' OR email like '%${searchUser}%' OR phone like '%${searchUser}%')\n`;
  }

  if (startDate) {
    startDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    console.log("start date");
    console.log(startDate);
    let attr = result.indexOf("WHERE") > -1 ? "AND" : "WHERE";
    result = `${result} ${attr} createdAt >= '${startDate}'\n`;
  }

  if (endDate) {
    endDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");
    console.log("end date");
    console.log(endDate);
    let attr = result.indexOf("WHERE") > -1 ? "AND" : "WHERE";
    result = `${result} ${attr} createdAt <= '${endDate}'\n`;
  }

  result = `${result}order by createdAt desc\n`;

  if (limit) {
    result = `${result}limit ${limit}\n`;
  }

  if (skip !== null && skip !== undefined) {
    result = `${result}offset ${skip}\n`;
  }

  return result;
}

module.exports = {
  find,
  count,
  findToken,
};
