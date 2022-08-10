module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define("Order", {
    RallyYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2023,
      unique: 'Orders_unique'
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'Orders_unique'
    },
    ShirtSize: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ShirtStyle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PassUserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PassShirtSize: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PassShirtStyle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PriceTier: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CheckoutID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    OrderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    uniqueKeys: {
      Orders_unique: {
        fields: ['RallyYear', 'UserID']
      }
    }
  });

  return Order;
};
