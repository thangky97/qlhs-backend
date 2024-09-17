const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const UserquizSchema = sequelize.define(
    "user_quizs",
    {
      usersId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      curriculumLecturesQuizId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      answer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      value: {
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

  return UserquizSchema;
};
