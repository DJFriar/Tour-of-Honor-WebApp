/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const EarnedTrophies = sequelize.define(
    'EarnedTrophiesXref',
    {
      RegionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      PlaceNum: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      FlagNumbers: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      RallyYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    },
  );
  return EarnedTrophies;
};
