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
    email: {
    	type: DataTypes.STRING(100)
    },
    birthday: DataTypes.DATE,
    retirement_age: DataTypes.INTEGER,
    retirement_cost: DataTypes.INTEGER,
    retirement_withdrawal: {
    	type: DataTypes.FLOAT,
    	defaultValue: 0.4
    },
    yearly_growth: {
    	type: DataTypes.FLOAT,
    	defaultValue: 0.6
    },
    income_increase: { 
    	type: DataTypes.FLOAT,
    	defaultValue: 0
    }
  });
  return User;
};
