const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    const UserRoleSchema = sequelize.define('language', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        code: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{
        timestamps: false
    });

    return UserRoleSchema;
}