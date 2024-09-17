const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const LecturesSchema = sequelize.define(
    "curriculum_lectures_quizzes",
    {
      status: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        comment: "0 : deactive, 1 : active",
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contenttext: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      media: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      media_type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      publish: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      resources: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      correct_answer: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      answer: {
        type: Sequelize.TEXT("long"),
      },
      lang: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "vn",
      },
    },
    { timestamps: true }
  );

  return LecturesSchema;
};
