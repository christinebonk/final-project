module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define("Account", {
    text: DataTypes.STRING,
    complete: DataTypes.BOOLEAN
  });
  return Account;
};
