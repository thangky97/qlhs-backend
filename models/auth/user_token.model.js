const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const UsertokenSchema = sequelize.define(
    "user_tokens",
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  return UsertokenSchema;
};
