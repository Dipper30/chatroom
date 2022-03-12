'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatRoom.init({
    uuid: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true
    },
    rid: DataTypes.STRING,
    createTime: DataTypes.INTEGER,
    expireTime: DataTypes.INTEGER,
    creatorId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ChatRoom',
  });
  return ChatRoom;
};