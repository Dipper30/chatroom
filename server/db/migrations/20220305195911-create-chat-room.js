'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChatRooms', {
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      rid: {
        type: Sequelize.STRING,
        validate: {
          len: [4, 20]
        }
      },
      createTime: {
        type: Sequelize.INTEGER(10),
      },
      expireTime: {
        type: Sequelize.INTEGER(10),
      },
      creatorId: {
        type: Sequelize.INTEGER,
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