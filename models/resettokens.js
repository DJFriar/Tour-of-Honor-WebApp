module.exports = function(sequelize, DataTypes) {
  const ResetToken = sequelize.define("ResetToken", {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Token: {
        type: DataTypes.STRING,
        allowNull: false,
      }
  });
  return ResetToken;
};

