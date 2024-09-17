const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const UserSchema = sequelize.define("users", {
    username: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(125),
      allowNull: true,
    },
    first_name: {
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(25),
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    avatar: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: "0 : deactive, 1 active, 2 : blocked",
    },
  });

  return UserSchema;
};
