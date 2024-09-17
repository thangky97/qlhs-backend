const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const UserTrainingHistorySchema = sequelize.define(
    "user_training_historys",
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cloudServiceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      training_type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      start: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  return UserTrainingHistorySchema;
};
