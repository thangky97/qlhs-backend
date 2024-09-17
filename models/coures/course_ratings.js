const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const CourseRatingSchema = sequelize.define(
    "courseratings",
    {
      usersId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rating: {
        type: Sequelize.DECIMAL(8, 1),
        allowNull: true,
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.STRING,
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
  return CourseRatingSchema;
};
