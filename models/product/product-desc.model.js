const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const ProductDescSchema = sequelize.define(
    "product_description",
    {
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sort_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lang: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "product_description",
      timestamps: false,
    }
  );

  return ProductDescSchema;
};
