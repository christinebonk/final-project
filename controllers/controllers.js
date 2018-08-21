var db = require("../models");
var bodyparser = require("body-parser");
var bcrypt = require('bcrypt');
const saltRounds = 10;


function routes(app) {
	//pages
	app.get("/", function(req, res){
		res.render("index");
	});

	app.get("/goals", function(req,res) {
		res.render('goals', {layout: 'onboarding.handlebars'});
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

	app.get("/dashboard", function(req,res) {
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
			}).then(function(res) {
		    });	
		});

			
	});
};

module.exports = routes;