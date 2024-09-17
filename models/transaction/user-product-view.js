"use strict";
require("dotenv").config();
const viewTableName = "product_view";

async function createUserProductView(sequelize) {
  const userTableName = "users";
  // const productTableName = "product_name";

  // let fields = [`${productTableName}.name as product_name`];

  let queryString = "select ";
  for (let i = 0; i < fields.length; i++) {
    queryString = queryString + fields[i] + ", ";
  }
  queryString = queryString.substring(0, queryString.length - 2);

  // queryString =
  //   queryString +
  //   `
  //     from ${userProductTableName}
  //     left join ${userTableName} on ${userProductTableName}.user_id = ${userTableName}.id
  //     left join ${productTableName} on ${userProductTableName}.product_id = ${productTableName}.product_id
  //   `;

  await sequelize.query(
    `CREATE OR REPLACE VIEW ${viewTableName} AS (\n ${queryString} \n)`
  );
}

module.exports = {
  createUserProductView,
  viewTableName,
};
