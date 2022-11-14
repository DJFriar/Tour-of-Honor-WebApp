/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Rule = sequelize.define('Rule', {
    RuleNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RuleText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Rule;
};
