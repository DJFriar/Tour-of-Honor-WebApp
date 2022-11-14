/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const TimeZone = sequelize.define('TimeZone', {
    ShortName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LongName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ZoneName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return TimeZone;
};
