'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserBalance extends Model {
    static associate(models) {}
  }

  UserBalance.init(
    {
      credits: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'UserBalance',
      tableName: 'User_balances',
      freezeTableName: true,
    }
  );

  return UserBalance;
};