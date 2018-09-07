module.exports = function(sequelize, DataTypes) {
  var Budget = sequelize.define("Budget", {
  	username: DataTypes.STRING,
  	name: DataTypes.STRING,    
  	amount: DataTypes.INTEGER,
    type: DataTypes.STRING,
    time: DataTypes.INTEGER
  });
  return Budget;
};
