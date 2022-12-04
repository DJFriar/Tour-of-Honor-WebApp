/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Region = sequelize.define('Region', {
    Region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    MemorialCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Region;
};
