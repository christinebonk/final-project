var express = require("express");
var app = express();
var port = process.env.PORT || 3001;
var path = require("path");
var routes = require("./controllers/controllers.js");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var db = require("./models");

//authentication packages
var session = require("express-session");
var passport = require("passport");
var MySQLStore = require('express-mysql-session')(session);
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt");

//this will need to be updated 
var options = {
	user: "root",
    password: "password",
    database: "fire",
    host: "127.0.0.1",
    port: 3306
};
var sessionStore = new MySQLStore(options);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build/')));

app.use(session({
  secret: 'o1mQYsAjjBTalmA',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req,res,next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
})

//check for user name 
passport.use(new LocalStrategy(
	function(username, password, done) {
  		console.log(username);
  		console.log(password);

      	db.User.find({where: {username:username}}).then(function(result) {
      		console.log(result);
      		console.log(result.password);
      		if (result.password.length === 0) {
      			return done(null, false);
      		} else {
      			var hash = result.password;
				var userid = result.id;

	      		bcrypt.compare(password, hash, function(err, response) {
	      			console.log(response);
	      			if(response === true) {
	      				return done(null, {userid: userid});
	      			} else {
	      				return done(null, false);
	      			}
				});
      		}
			
		}).catch(function (err) {
			if (err) { console.log(err); }
		});	
	})
);


  


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

routes(app);

db.sequelize.sync().then(function() {
  app.listen(port, function() {
    console.log("App listening on PORT " + port);
  });
});

