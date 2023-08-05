/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Bike = sequelize.define('Bike', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    make_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Bike;
};
