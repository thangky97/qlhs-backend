"use strict";
require("dotenv").config();
const viewTableName = "transactions";

async function createTransactionView(sequelize) {
  let queryString = "select ";
  for (let i = 0; i < fields.length; i++) {
    queryString = queryString + fields[i] + ", ";
  }
  queryString = queryString.substring(0, queryString.length - 2);

  queryString = await sequelize.query(
    `CREATE OR REPLACE VIEW ${viewTableName} AS (\n ${queryString} \n)`
  );
}

module.exports = {
  createTransactionView,
  viewTableName,
};
