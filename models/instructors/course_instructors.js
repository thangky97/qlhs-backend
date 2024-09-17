const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const courseinstructorsSchema = sequelize.define("courseinstructors", {
    instructorId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    levelId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });
  return courseinstructorsSchema;
};
