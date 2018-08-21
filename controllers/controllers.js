var db = require("../models");
var bodyparser = require("body-parser");
var { check, validationResult } = require('express-validator/check');



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

	//apis


	//to do - fix validation
	app.post("/signup", [
		check('username').isLength({ max: 15})
		.not().isEmpty()
		.trim()
		.escape(),
		check('password').isLength({ min: 6 })
		.isLength({ max: 60})
		.not().isEmpty()
		.trim()
		.escape(),
		check('email').isEmail()
		.normalizeEmail()
		.trim()
		.escape(),
		], function(req,res,next) {

		var errors = validationResult(req);
		console.log(errors);
		  if (!errors.isEmpty()) {
		    return res.render("index", {errors: errors});
		  }

		db.User.create({
	      username: req.body.username,
	      password: req.body.password,
	      email: req.body.email
		}).then(function(res) {
	    });		
	});
};

module.exports = routes;