/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Order = sequelize.define(
    'Order',
    {
      RallyYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2024,
        unique: 'Orders_unique',
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'Orders_unique',
      },
      NextStepNum: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ShirtSize: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ShirtStyle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PassUserID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      PassShirtSize: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PassShirtStyle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PriceTier: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CharityChosen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      CheckoutID: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      CheckoutURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      OrderNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      RequestedRiderFlagNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      RequestedPassFlagNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      applyFlagSurcharge: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      FlagSurchargeCheckoutID: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      FlagSurchargeCheckoutURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      FlagSurchargeOrderNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      uniqueKeys: {
        Orders_unique: {
          fields: ['RallyYear', 'UserID'],
        },
      },
    },
  );

  return Order;
};
