module.exports = function(sequelize, DataTypes) {
  const Flag = sequelize.define("Flag", {
    FlagNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'Flags_unique',
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
    }
  }, {
    uniqueKeys: {
      Flags_unique: {
        fields: ['FlagNum', 'UserID', 'RallyYear']
      }
    }
  });
  return Flag;
};