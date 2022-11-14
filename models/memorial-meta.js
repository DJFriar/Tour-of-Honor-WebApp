/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const MemorialMeta = sequelize.define('MemorialMeta', {
    MemorialID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Heading: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return MemorialMeta;
};
