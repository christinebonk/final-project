var db = require("../models");
var bodyparser = require("body-parser");


function routes(app) {
	//pages
	app.get("/", function(req, res){
		res.render("index");
	});

	app.get("/welcome", function(req,res) {
		res.render('index', {layout: 'onboarding.handlebars'});
	})

	//apis
};

module.exports = routes;