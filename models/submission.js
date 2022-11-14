/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Submission = sequelize.define('Submission', {
    UserID: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    MemorialID: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
      defaultValue: 0,
    },
    ScorerNotes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    RiderNotes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    OtherRiders: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Source: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });

  return Submission;
};
