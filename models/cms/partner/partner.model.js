const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    const PartnerSchema = sequelize.define('partner', {
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        image: {
            type: Sequelize.STRING,
            allowNull: false
        },
        priority_index: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    }, {
        timestamps: false
    });

    return PartnerSchema;
}