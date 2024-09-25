const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const SemesterSchema = sequelize.define(
    "semesters",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
  return SemesterSchema;
};
