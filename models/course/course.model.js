const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const CourseSchema = sequelize.define(
    "courses",
    {
      code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
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
  return CourseSchema;
};
