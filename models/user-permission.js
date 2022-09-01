module.exports = function(sequelize, DataTypes) {
  const UserPermission = sequelize.define("UserPermission", {
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'UserPermissions_unique'
    },
    GroupID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'UserPermissions_unique'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
  }, {
    uniqueKeys: {
      UserPermissions_unique: {
        fields: ['UserID', 'GroupID']
      }
    }
  });

  return UserPermission;
};