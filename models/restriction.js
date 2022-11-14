/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Restriction = sequelize.define('Restriction', {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Restriction;
};
