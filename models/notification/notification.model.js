const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const NotificationSchema = sequelize.define("notifications", {
    code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    message_content: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    message_type: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    usersId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return NotificationSchema;
};
