const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const SectionSchema = sequelize.define(
    "schedule",
    {
      date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      class: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      room: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instructorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      time: {
        type: Sequelize.STRING,
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

  return SectionSchema;
};
