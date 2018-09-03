var db = require("../models");
var bodyparser = require("body-parser");
var bcrypt = require('bcrypt');
const saltRounds = 10;
var passport = require("passport");


function routes(app) {
	//pages
	app.get("/", function(req, res){
		console.log("hello")
		res.render("index");
	});

	app.get("/goals", function(req,res) {
		res.render('goals', {layout: 'onboarding.handlebars', title: 'Your Goals'});
		console.log("hi");
	});

	app.get("/networth", function(req,res) {
		res.render('networth', {layout: 'onboarding.handlebars'});
	});

	app.get("/income", function(req,res) {
		res.render('income', {layout: 'onboarding.handlebars'});
	});

	app.get("/budget", function(req,res) {
		res.render('budget', {layout: 'onboarding.handlebars'});
	});

	app.get("/result", function(req,res) {
		res.render('result', {layout: 'onboarding.handlebars'});
	});

	app.get("/monthly", function(req,res) {
		res.render('monthly', {title: "Monthly Insights"});
	});

	app.get("/dashboard", authenticationMiddleware(), function(req,res) {
		console.log(req.user);
		console.log(req.isAuthenticated());
		res.render('freedom', {title: "Financial Freedom Dashboard"});
	});

	//apis to do - fix validation
	app.post("/signup", function(req,res,next) {
		var password = req.body.password;
		var username = req.body.username;
		var email = req.body.email;
		bcrypt.hash(password, saltRounds, function(err, hash) {
  			db.User.create({
		      username: username,
		      password: hash,
		      email: email
			}).then(function(result) {
				db.User.find({where: {username: username}}).then(function(result) {
					var userid = result.id;
					console.log(userid);
					req.login(userid, function(err) {
						if (err) { console.log(err); }
						res.json("complete");
					}).catch(function (err) {
  						if (err) { console.log(err); }
					});
				})
		    });	
		});		
	});

	app.get("/login", passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/"
	}));
};

passport.serializeUser(function(userid, done) {
  done(null, userid);
});
 
passport.deserializeUser(function(userid, done) {
    done(null, userid);
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/')
	}
}

module.exports = routes;