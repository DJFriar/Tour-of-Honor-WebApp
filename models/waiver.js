module.exports = function(sequelize, DataTypes) {
  const Waiver = sequelize.define("Waiver", {
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'Waiver_unique',
    },
    WaiverID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RallyYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'Waiver_unique',
    }
  }, {
    uniqueKeys: {
      Waiver_unique: {
        fields: ['UserID', 'RallyYear']
      }
    }
  });
  return Waiver;
};