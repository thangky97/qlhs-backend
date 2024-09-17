const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  const M_Token = sequelize.define('M_Token', {
    Token_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Token: {
      type: Sequelize.TEXT,
      allowNull: false,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    },
    Token_Expired: {
      type: Sequelize.DATE,
      allowNull: false
    },
    User_ID: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    Note: {
      type: Sequelize.TEXT('medium'),
      allowNull: true,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    }
  }, {
    tableName: 'M_Token',
    timestamps: false
  })
  return M_Token;
};