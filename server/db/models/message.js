'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, { as : 'User', foreignKey: 'uid', targetKey: 'id' })
      // Comment.belongsTo(models.User, { foreignKey: 'uid' })
    }
  }
  Message.init({
    uid: DataTypes.INTEGER,
    content: DataTypes.STRING,
    cid: DataTypes.UUID,
    createTime: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};