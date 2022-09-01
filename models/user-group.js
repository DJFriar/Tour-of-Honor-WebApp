module.exports = function(sequelize, DataTypes) {
  const UserGroup = sequelize.define("UserGroup", {
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    IsAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    IsProtected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
  });

  return UserGroup;
};
