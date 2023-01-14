/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const AuthToken = sequelize.define('AuthToken', {
    Token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  return AuthToken;
};
