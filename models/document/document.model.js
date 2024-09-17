const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const DocumentSchema = sequelize.define("document", {
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: "0 : deactive, 1 : active",
    },
    sort_order: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    categoryPostId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    open: {
      type: Sequelize.INTEGER(1),
      allowNull: true,
      defaultValue: 0,
      comment: "0 : hide, 1 : show",
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return DocumentSchema;
};
