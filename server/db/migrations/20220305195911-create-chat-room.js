'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChatRooms', {
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          len: [4, 20]
        }
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChatRooms');
  }
};