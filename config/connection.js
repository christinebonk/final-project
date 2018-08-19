var mysql = require("mysql2");
var Sequelize = require("sequelize");
var sequelize = new Sequelize("us-cdbr-iron-east-01.cleardb.net", "b31dfb0ca17120", "8a9b6469", {
  host: "us-cdbr-iron-east-01.cleardb.net",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;