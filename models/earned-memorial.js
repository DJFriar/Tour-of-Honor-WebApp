module.exports = function(sequelize, DataTypes) {
  const EarnedMemorials = sequelize.define("EarnedMemorialsXref", {
    FlagNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'EarnedMemorials_unique',
    },
    MemorialID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'EarnedMemorials_unique',
    },
    RallyYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'EarnedMemorials_unique',
    }
  }, {
    freezeTableName: true,
    uniqueKeys: {
      EarnedMemorials_unique: {
        fields: ['FlagNum', 'MemorialID', 'RallyYear']
      }
    }
  });
  return EarnedMemorials;
};

