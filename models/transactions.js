module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define("Transaction", {
  	username: DataTypes.STRING,
    item: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    category: DataTypes.STRING,
    subcategory: DataTypes.STRING,
    transaction_date: DataTypes.DATE,
    happy: DataTypes.BOOLEAN
  });
  return Transaction;
};
