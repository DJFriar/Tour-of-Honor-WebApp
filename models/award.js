/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Award = sequelize.define('Award', {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    FlagNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RideDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RallyYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Award;
};
