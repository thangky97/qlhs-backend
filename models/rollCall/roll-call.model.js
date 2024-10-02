const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const RollCallSchema = sequelize.define(
    "roll_calls",
    {
      curriculumSectionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      time: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        comment: "0 : vắng, 1 : có mặt, 2 : trễ",
      },
    },
    { timestamps: true }
  );

  return RollCallSchema;
};
