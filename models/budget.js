module.exports = function(sequelize, DataTypes) {
  var Budget = sequelize.define("Budget", {
    text: DataTypes.STRING,
    complete: DataTypes.BOOLEAN
  });
  return Budget;
};
