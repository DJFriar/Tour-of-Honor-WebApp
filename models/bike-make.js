/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const BikeMake = sequelize.define('BikeMake', {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return BikeMake;
};
