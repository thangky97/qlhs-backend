const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const InstructorsSchema = sequelize.define(
    "instructors",
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instructor_slug: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telephone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paypalId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      link_facebook: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      link_linkedin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      link_twitter: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      link_googleplus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      biography: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      instructor_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_credits: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      lang: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        comment: "0 : deactive, 1 : active",
      },
    },
    {
      timestamps: true,
    }
  );
  return InstructorsSchema;
};
