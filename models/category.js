module.exports = function(sequelize, DataTypes) {
  const Category = sequelize.define("Category", {
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    },
  });

  return Category;
};

