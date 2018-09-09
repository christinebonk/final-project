module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: { 
    	type: DataTypes.STRING(15),
    	allowNull: false,
    	unique: true
    },
    password: {
    	type: DataTypes.STRING(60),
    	allowNull: false
    },
    retirement_date: DataTypes.INTEGER(4),
    retirement_cost: DataTypes.INTEGER,
    retirement_contribution: DataTypes.INTEGER,
    retirement_withdrawal: {
    	type: DataTypes.FLOAT,
    	defaultValue: 0.04
    },
    yearly_growth: {
    	type: DataTypes.FLOAT,
    	defaultValue: 0.06
    },
    income_increase: { 
    	type: DataTypes.FLOAT,
    	defaultValue: 0
    }
  });
  return User;
};
