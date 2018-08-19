module.exports = function(sequelize, DataTypes) {
  var Budget = sequelize.define("Budget", {
  	username: DataTypes.STRING,
    category: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    type: DataTypes.STRING
  });
  return Budget;
};
