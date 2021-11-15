// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
const bcrypt = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ZipCode: {
      type:DataTypes.STRING,
    },
    ProfilePic: {
      type: DataTypes.STRING
    },
    FlagNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PillionFlagNumber: {
      type: DataTypes.INTEGER,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1
    }
  });

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
  // Before a rider is created, we will automatically hash their password
  User.addHook("beforeCreate", user => {
    user.Password = bcrypt.hashSync(
      user.Password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  return User;
};
