module.exports = function(sequelize, DataTypes) {
  const IBARide = sequelize.define("IBARide", {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RideDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RallyYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
  return IBARide;
};