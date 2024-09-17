const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    const DocumentContentSchema = sequelize.define('document_content', {
        document_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        short_content: {
            type: Sequelize.STRING(1000),
            allowNull: false
        },
        lang: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'document_content',
        timestamps: false
    });

    return DocumentContentSchema;
}