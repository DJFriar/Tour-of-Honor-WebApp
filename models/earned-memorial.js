module.exports = function(sequelize, DataTypes) {
  const EarnedMemorials = sequelize.define("EarnedMemorialsXref", {
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MemorialID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    freezeTableName: true
  });
  return EarnedMemorials;
};

