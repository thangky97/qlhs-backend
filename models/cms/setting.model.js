const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    const SettingSchema = sequelize.define('setting', {
        logo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        phone_1: {
            type: Sequelize.STRING,
            allowNull: true
        },
        phone_2: {
            type: Sequelize.STRING,
            allowNull: true
        },
        map_source: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        footer_text: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            defaultTo: ""
        }
    }, {
        timestamps: false
    });

    return SettingSchema;
}