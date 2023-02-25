/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Flag = sequelize.define(
    'Flag',
    {
      FlagNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'Flags_unique',
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'Users_unique',
      },
      RallyYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: ['Flags_unique', 'Users_unique'],
      },
    },
    {
      uniqueKeys: {
        Flags_unique: {
          fields: ['FlagNumber', 'RallyYear'],
        },
        Users_unique: {
          fields: ['UserID', 'RallyYear'],
        },
      },
    },
  );
  return Flag;
};
