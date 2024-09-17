const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const CourseVideoSchema = sequelize.define(
    "coursevideos",
    {
      video_title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      video_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      video_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image_name: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      video_tag: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      uploaderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      processed: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lang: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  return CourseVideoSchema;
};
