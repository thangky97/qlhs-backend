const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const UserProductSchema = sequelize.define("user_product", {
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    product_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    vat: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    transactionId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    total_price: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    service: {
      type: Sequelize.ENUM,
      values: ["local", "cloud"],
      allowNull: false,
    },

    buy_reject_delete: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "transaction reject khi mua sẽ xóa",
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    token_url: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    total_product: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    lang: {
      type: Sequelize.STRING,
    },
    discount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return UserProductSchema;
};
