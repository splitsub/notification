'use strict';
const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class notificationDump extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    notificationDump.init({
        config: Sequelize.TEXT,
        request: Sequelize.TEXT,
        type: Sequelize.STRING,
        response: Sequelize.TEXT,
        clientSlug: Sequelize.STRING
    }, {
        sequelize,
        modelName: 'notificationDump',
        freezeTableName: true,
        tableName: 'notificationDump'
    });

    return notificationDump;
};