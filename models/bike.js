module.exports = function(sequelize, DataTypes) {
  const Bike = sequelize.define("Bike", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    BikeName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Color: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Bike;
};
