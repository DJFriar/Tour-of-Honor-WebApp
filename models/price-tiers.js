module.exports = function(sequelize, DataTypes) {
  const PriceTier = sequelize.define("PriceTier", {
    Tier: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ShopifyVariantID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  });
  return PriceTier;
};

