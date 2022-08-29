module.exports = function(sequelize, DataTypes) {
  const Charity = sequelize.define("Charity", {
    RallyYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2023,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    URL: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Charity;
};
