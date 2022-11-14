module.exports = (sequelize, DataTypes) => {
  const Flag = sequelize.define(
    'Flag',
    {
      FlagNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'Flags_unique',
      },
      RallyYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'Flags_unique',
      },
    },
    {
      uniqueKeys: {
        Flags_unique: {
          fields: ['UserID', 'RallyYear'],
        },
      },
    },
  );
  return Flag;
};
