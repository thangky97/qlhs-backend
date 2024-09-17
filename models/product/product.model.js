const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const ProductSchema = sequelize.define("product", {
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    url_ytb: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    url_demo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    url_tutorial: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    number_trial: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    link_trial: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Chi apply với service Local",
    },
    link_download: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Chi apply với service Local",
    },
    vat: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: "0 : deactive, 1 : active, 2:out of stock",
    },
    product_type: {
      type: Sequelize.INTEGER(3),
      allowNull: false,
      defaultValue: 1,
    },
    allow_display: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: "0 : allow, 1 : notallow",
    },
    open: {
      type: Sequelize.INTEGER(1),
      allowNull: true,
      defaultValue: 0,
      comment: "0 : hide, 1 : show",
    },
    instructorId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    is_deleted: {
      type: Sequelize.INTEGER(1),
      defaultValue: 0,
      comment: "0 : not deleted, 1 : deleted",
    },

    is_monitor: {
      type: Sequelize.INTEGER(1),
      defaultValue: 0,
    },
    priority_index: {
      type: Sequelize.INTEGER(1),
      defaultValue: 0,
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "vn",
    },
  });

  return ProductSchema;
};
