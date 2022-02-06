module.exports = function(sequelize, DataTypes) {
  const Memorial = sequelize.define("Memorial", {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Category: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Latitude: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    Longitude: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    Address1: {
      type: DataTypes.STRING,
    },
    Address2: {
      type: DataTypes.STRING,
    },
    City: {
      type: DataTypes.STRING,
    },
    State: {
      type: DataTypes.STRING(2),
    },
    SampleImage: {
      type: DataTypes.STRING,
    },
    Access: {
      type: DataTypes.STRING,
    },
    MultiImage: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0        
    },
    Restrictions: {
      type: DataTypes.INTEGER,
      defaultValue: 0        
    },
    RallyYear: {
      type: DataTypes.INTEGER
    },
    URL: {
      type: DataTypes.STRING,
    },
  });

  return Memorial;
};

