const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const TranscriptSchema = sequelize.define("transcripts", {
    usersId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    total_score: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    status: {
      type: Sequelize.INTEGER(),
      allowNull: false,
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "vn",
    },
  });

  return TranscriptSchema;
};
