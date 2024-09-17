const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const UsersectionprogressSchema = sequelize.define("usersectionprogress", {
    usersId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
      comment: "0 : progress, 1 : complete",
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "vn",
    },
  });

  return UsersectionprogressSchema;
};
