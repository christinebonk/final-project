module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define("Account", {
  	userid: DataTypes.STRING,
    account: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    type: DataTypes.STRING,
    include: DataTypes.BOOLEAN,
    interest: DataTypes.FLOAT
  });
  return Account;
};
