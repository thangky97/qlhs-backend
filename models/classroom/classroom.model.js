const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const ClassroomSchema = sequelize.define(
    "classrooms",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      area: {
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
  return ClassroomSchema;
};
