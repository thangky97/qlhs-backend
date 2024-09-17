const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const demoCloudApplicationSchema = sequelize.define("democloudapplications", {
    productId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    short_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    long_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    demo_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    sample_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    priority_index: {
      type: Sequelize.INTEGER(1),
      defaultValue: 0,
    },
  });
  return demoCloudApplicationSchema;
};
