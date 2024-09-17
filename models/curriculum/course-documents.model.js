const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const UserquizSchema = sequelize.define(
    "course_documents",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      show_download: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        comment: "0 : no show, 1 : show",
      },
      status: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        comment: "0 : deactive, 1 : active",
      },
      short_content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileurl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lang: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "vn",
      },
    },
    { timestamps: true }
  );

  return UserquizSchema;
};
