const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const SectionSchema = sequelize.define(
    "curriculum_sections",
    {
      code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      number_students: {
        type: Sequelize.STRING,
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
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instructorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      courseId: {
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
      lang: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "vn",
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  return SectionSchema;
};
