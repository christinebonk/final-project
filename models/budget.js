module.exports = function(sequelize, DataTypes) {
  var Budget = sequelize.define("Budget", {
  	userid: DataTypes.STRING,
  	name: DataTypes.STRING,    
  	amount: DataTypes.INTEGER,
    type: DataTypes.STRING,
    time: DataTypes.INTEGER,
    period: DataTypes.STRING
  });
  return Budget;
};
