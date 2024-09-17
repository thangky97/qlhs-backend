const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  const M_Q_Traffic_Machine = sequelize.define('M_Q_Traffic_Machine', {
    Q_Traffic_Machine_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Q_Traffic_Machine_Version: {
      type: Sequelize.TEXT('medium'),
      allowNull: true
    },
    Update_DateTime: {
      type: Sequelize.DATE(6),
      allowNull: true
    }
  }, {
    tableName: 'M_Q_Traffic_Machine',
    timestamps: false
  });

  return M_Q_Traffic_Machine;
}