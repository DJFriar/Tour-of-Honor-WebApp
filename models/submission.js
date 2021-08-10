module.exports = function(sequelize, DataTypes) {
  const Submission = sequelize.define("Submission", {
    UserID: {
      type: DataTypes.INTEGER,
      defaultValue: 0      
    },
    MemorialID: {
      type: DataTypes.INTEGER,
      defaultValue: 0  
    },
    PrimaryImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    OptionalImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  });

  return Submission;
};

