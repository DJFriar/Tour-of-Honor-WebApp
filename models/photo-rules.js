/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const PhotoRule = sequelize.define('PhotoRule', {
    RuleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RuleText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return PhotoRule;
};
