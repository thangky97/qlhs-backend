const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const DepartmentSchema = sequelize.define(
    "departments",
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
      trainingProgramId: {
        type: Sequelize.INTEGER,
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
  return DepartmentSchema;
};
