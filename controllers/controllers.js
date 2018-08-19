var db = require("../models");
var bodyparser = require("body-parser");


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



	//apis
};

module.exports = routes;