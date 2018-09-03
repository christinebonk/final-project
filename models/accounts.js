module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define("Account", {
  	userid: {
    	type: DataTypes.STRING(10),
    	allowNull: false
    },
    account: {
    	type: DataTypes.STRING(40),
    	allowNull: false
    },
    balance: {
    	type: DataTypes.INTEGER(40),
    	allowNull: false
    },
    type: {
    	type: DataTypes.STRING(40),
    	allowNull: false
    },
    include: {
    	type: DataTypes.BOOLEAN,
    	allowNull: false
    },
    interest: DataTypes.FLOAT
  });
  return Account;
};


