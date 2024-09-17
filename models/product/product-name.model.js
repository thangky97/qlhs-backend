const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const ProductNameSchema = sequelize.define(
    "product_name",
    {
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    },
    {
      tableName: "product_name",
      timestamps: false,
    }
  );

  return ProductNameSchema;
};
