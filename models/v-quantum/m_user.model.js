const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  const M_User = sequelize.define('M_User', {
    User_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    User_Name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    },
    Password: {
      type: Sequelize.TEXT('medium'),
      allowNull: false,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    },
    Token: {
      type: Sequelize.TEXT,
      allowNull: true,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    },
    Email: {
      type: Sequelize.STRING(125),
      allowNull: false,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    },
    Note: {
      type: Sequelize.TEXT('medium'),
      allowNull: true,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    },
    UserMappingId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'M_User',
    timestamps: false
  })
  return M_User;
};