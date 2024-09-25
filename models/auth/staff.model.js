const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const StaffSchema = sequelize.define("staff", {
    username: {
      type: Sequelize.STRING(25),
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
    role: {
      type: Sequelize.STRING(1000),
      allowNull: false,
      defaultValue: "MANAGE_STAFF",
    },
    status: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: "0 : deactive, 1 active, 2 : tham gia, 3: chua tham gia",
    },
    position: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    departmentId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    curriculumSectionId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    avatar: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    code: {
      type: Sequelize.STRING(25),
      allowNull: true,
    },
  });

  return StaffSchema;
};
