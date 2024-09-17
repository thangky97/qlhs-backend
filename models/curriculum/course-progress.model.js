const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const progressSchema = sequelize.define(
    "courseprogresses",
    {
      usersId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      progress: {
        type: Sequelize.INTEGER,
        default: 0,
        allowNull: true,
      },
      answer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      curriculumLecturesQuizId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        comment: "0 : deactive, 1 : active",
      },

      lang: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "vn",
      },
    },

    { timestamps: true }
  );

  return progressSchema;
};
