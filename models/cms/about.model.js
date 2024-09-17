const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const AboutSchema = sequelize.define(
    "about",
    {
      about: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lang: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      section_intro_1: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      section_intro_2: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      section_intro_3: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      section_system: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      section_product: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      section_service: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      section_partner: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      section_about: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      privacy_policy: {
        type: Sequelize.TEXT("long"),
      },
      terms_of_use: {
        type: Sequelize.TEXT("long"),
      },
      faq: {
        type: Sequelize.TEXT("long"),
      },
      company_name: {
        type: Sequelize.STRING,
      },
      founded: {
        type: Sequelize.STRING,
      },
      officer: {
        type: Sequelize.STRING,
      },
      advisor: {
        type: Sequelize.STRING,
      },
      my_cloud: {
        type: Sequelize.TEXT("long"),
      },
      link_cloud: {
        type: Sequelize.TEXT("long"),
      },
      user_guide_cloud: {
        type: Sequelize.TEXT("long"),
      },
    },
    {
      tableName: "about",
      timestamps: false,
    }
  );

  return AboutSchema;
};
