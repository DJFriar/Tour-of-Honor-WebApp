/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Config = sequelize.define('Config', {
    KeyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    iValue: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Config;
};
