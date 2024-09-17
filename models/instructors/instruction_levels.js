const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const InstructionLevelsSchema = sequelize.define("instructorslevels", {
    level: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return InstructionLevelsSchema;
};
