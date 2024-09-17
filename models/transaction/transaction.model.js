const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const TransactionSchema = sequelize.define("transaction", {
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_payment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(25),
      allowNull: true,
    },
    company_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    zip_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    payment_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    total_money: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },

    note: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ["pending", "paid", "failed"],
      defaultValue: "pending",
    },
    type: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    trial_type: {
      type: Sequelize.STRING,
    },
    startDate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    endDate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lang: {
      type: Sequelize.STRING,
    },
  });

  return TransactionSchema;
};
