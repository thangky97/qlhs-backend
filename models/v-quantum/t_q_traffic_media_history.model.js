const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  const T_Q_Traffic_Media_History = sequelize.define('T_Q_Traffic_Media_History', {
  
    Media_URL: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    Media_Type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    DateTime: {
      type: Sequelize.DATE(6),
      allowNull: false
    },
    Intersection_ID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Camera_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'T_Q_Traffic_Media_History',
    timestamps: false
  })
  return T_Q_Traffic_Media_History;
}