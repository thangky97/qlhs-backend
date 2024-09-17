const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    const DocumentLabelSchema = sequelize.define('document_label', {
        document_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        label: {
            type: Sequelize.STRING(500),
            allowNull: false
        },
        lang: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'document_label',
        timestamps: false
    });

    return DocumentLabelSchema;
}