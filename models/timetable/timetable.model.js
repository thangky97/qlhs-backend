const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const TimetableSchema = sequelize.define(
    "timetables",
    {
      staffId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lesson: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      classroomId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      semesterId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      practice_hours: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "so gio thuc hanh",
      },
      theory_hours: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "so gio ly thuyet",
      },
      curriculumSectionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
  return TimetableSchema;
};
