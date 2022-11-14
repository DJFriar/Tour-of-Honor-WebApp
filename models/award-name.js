/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const AwardName = sequelize.define('AwardName', {
    ShortName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    FullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return AwardName;
};
