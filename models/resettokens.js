module.exports = function(sequelize, DataTypes) {
  const ResetToken = sequelize.define("ResetToken", {
      Email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Expiration: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0
      }
  });
  return ResetToken;
};

