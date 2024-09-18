const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const DepartmentSchema = sequelize.define(
    "departments",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      position: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      usersId: {
        type: Sequelize.INTEGER,
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
  return DepartmentSchema;
};
