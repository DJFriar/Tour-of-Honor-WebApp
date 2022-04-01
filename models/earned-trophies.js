module.exports = function(sequelize, DataTypes) {
  const Trophy = sequelize.define("EarnedTrophiesXref", {
    RegionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PlaceNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RallyYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
  return Trophy;
};