/* eslint-disable func-names */
module.exports = function (sequelize, DataTypes) {
  const Faq = sequelize.define('Faq', {
    Question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Faq;
};
