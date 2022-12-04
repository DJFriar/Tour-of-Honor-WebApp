/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Passenger = sequelize.define(
    'Passenger',
    {
      RiderFlagNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'Passengers_unique',
      },
      PassengerFlagNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'Passengers_unique',
      },
      RallyYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'Passengers_unique',
      },
    },
    {
      uniqueKeys: {
        Passengers_unique: {
          fields: ['RiderFlagNumber', 'PassengerFlagNumber', 'RallyYear'],
        },
      },
    },
  );

  return Passenger;
};
