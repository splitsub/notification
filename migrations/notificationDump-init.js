'use strict';
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('notificationDump', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            config: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            request: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            response: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            clientSlug: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('notificationDump');
    }
};