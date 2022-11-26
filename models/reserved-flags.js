/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const ReservedFlag = sequelize.define(
    'ReservedFlag',
    {
      FlagNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'ReservedFlags_unique',
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ReservedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      uniqueKeys: {
        ReservedFlags_unique: {
          fields: ['FlagNumber'],
        },
      },
    },
  );
  return ReservedFlag;
};
