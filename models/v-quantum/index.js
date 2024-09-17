const { DATABASE_QTRAFFIC } = require("../../config/index");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  DATABASE_QTRAFFIC.DB_DATABASE_NAME,
  DATABASE_QTRAFFIC.DB_USER,
  DATABASE_QTRAFFIC.DB_USER_PASSWORD,
  {
    host: DATABASE_QTRAFFIC.DB_HOST,
    dialect: "mssql",
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: false,
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
    },
    logging: true,
  }
);

const db_qtraffic = {};
db_qtraffic.Sequelize = Sequelize;
db_qtraffic.sequelize = sequelize;

module.exports = db_qtraffic;
