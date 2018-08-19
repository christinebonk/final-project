module.exports = function(sequelize, DataTypes) {
  var Performance = sequelize.define("Performance", {
  	username: DataTypes.STRING,
    year: DataTypes.INTEGER,
    age: DataTypes.INTEGER,
    goal: DataTypes.INTEGER,
    actual: DataTypes.INTEGER
  });
  return Performance;
};
