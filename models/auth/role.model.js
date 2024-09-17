const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    const RoleSchema = sequelize.define('role', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{
        timestamps: false
    });

    return RoleSchema;
}