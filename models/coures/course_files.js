const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const CourseFilesSchema = sequelize.define(
    "coursefiles",
    {
      file_title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      file_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      file_extension: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      file_size: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      file_tag: {
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
  return CourseFilesSchema;
};
