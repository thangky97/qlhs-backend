const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const UsertokenDeatilSchema = sequelize.define(
    "userTokenDetails",
    {
      userTokenId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      transactionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productPriceType: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fromdate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      enddate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      usageCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        comment: "0 : deactive, 1 active, 2 : blocked",
      },
    },
    { timestamps: true }
  );

  return UsertokenDeatilSchema;
};
