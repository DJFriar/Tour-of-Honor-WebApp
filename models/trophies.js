/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Trophy = sequelize.define('Trophy', {
    RegionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PlaceNum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RallyYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FlagNumbers: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Trophy;
};
