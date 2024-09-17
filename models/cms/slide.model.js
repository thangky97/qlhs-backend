const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    const SlideSchema = sequelize.define('slide', {
        image: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        lang: {
            type: Sequelize.STRING,
            allowNull: false
        },
        url: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        priority_index: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    }, {
        timestamps: false
    });

    return SlideSchema;
}