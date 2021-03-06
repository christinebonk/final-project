var db = require("../models");
var bodyparser = require("body-parser");
var bcrypt = require('bcrypt');
const saltRounds = 10;
var passport = require("passport");
const path = require("path");



function routes(app) {
	//pages

	app.get("/", authenticationMiddleware(), function(req,res) {
		res.sendFile(path.join(__dirname, "../client/build/index.html"));
	});
	
	app.get("/homepage", function(req, res){
		res.render("index");
	});

	app.get("/homepage", function(req, res){
		res.render("index");
	});

	app.get("/goals", authenticationMiddleware(), function(req,res) {
		res.render('goals', {layout: 'onboarding.handlebars', title: `Let's Get Started!`});
	});

	app.get("/overview", authenticationMiddleware(), function(req,res) {
		res.sendFile(path.join(__dirname, "../client/build/index.html"));
	});

	app.get("/monthly", authenticationMiddleware(), function(req,res) {
		res.sendFile(path.join(__dirname, "../client/build/index.html"));
	});

	app.get("/income", authenticationMiddleware(), function(req,res) {
		res.render('income', {layout: 'onboarding.handlebars', title: 'Where does your money come from?'});
	});

	app.get("/networth", authenticationMiddleware(), function(req,res) {
		res.render('networth', {layout: 'onboarding.handlebars', title: "What do you already have?"});
	});

	app.get("/budget", function(req,res) {
		res.render('budget', {layout: 'onboarding.handlebars', title: "Where does your money go?"});
	});

	app.get("/result", function(req,res) {
		res.render('result', {layout: 'onboarding.handlebars', title: "Your FIRE Summary"});
	});

	app.get("/dashboard", authenticationMiddleware(), function(req,res) {
		console.log(req.isAuthenticated());
		res.render('freedom', {title: "Financial Freedom Dashboard"});
	});

	app.get("/success", function(req,res) {
		res.json("complete");
	});

	app.get("/logout", function(req,res) {
		req.logout();
		req.session.destroy();
		res.redirect("/homepage")
	})

	//apis to do - fix validation

	app.get("/profile", function(req,res,next) {
		var user = req.user.userid;
		if (!user) {
			user = req.user;
		}
		console.log(user);

		db.User.findAll({where: {id: user}}).then(function(result) {
			res.json(result);
		});
	})

	app.put("/profile", function(req,res,next) {
		var date = req.body.date;
		var amount = req.body.amount;
		var user = req.user.userid;
		var contribution = req.body.contribution; 
		var withdrawal = req.body.withdrawal;
		var growth = req.body.growth;
		var increase = req.body.increase;
		if (!user) {
			user = req.user;
		}

		db.User.update({
			retirement_date: date,
			retirement_cost: amount,
			retirement_contribution: contribution,
			income_increase: increase,
			yearly_growth: growth,
			retirement_withdrawal: withdrawal
		},
			{where: {id: user}
		}).then(function(result) {
			res.json(result);
		}).catch(function(err) {
			if (err) {console.log(err)};
		})
	});

	//make DRY
	app.get("/account", function (req,res,next) {
		var user = req.user.userid;
		if (!user) {
			user = req.user;
		}
		db.Account.findAll({where: {userid: user}}).then(function(result) {
			res.json(result);
		});
	});


	app.post("/account", function(req,res,next) {
		var type = req.body.type;
		var account = req.body.account;
		var balance = req.body.balance;
		var include = req.body.include;
		var user = req.user.userid;
		if (!user) {
			user = req.user;
		}

			db.Account.create({
				type: type,
				account: account,
				balance: balance,
				include: include,
				userid: user 
			}).then(function(result) {
				res.json("complete");
			})
	});

	app.put("/api/account", function(req,res,next) {
		var account = req.body.account;
		var balance = req.body.balance;
		var id = req.body.id;
		var user = req.user.userid;
		if (!user) {
			user = req.user;
		}
		db.Account.update({
			account: account,
			balance: balance
		},
			{where: {userid: user, id: id}
		}).then(function(result) {
			res.json(result);
		}).catch(function(err) {
			if (err) {console.log(err)};
		})
	})

	app.put("/income", function(req,res,next) {
		var name = req.body.name;
		var amount = req.body.amount;
		var time = req.body.time;
		var user = req.user.userid;
		var type = req.body.type;
		var period = req.body.period;
		if (!user) {
			user = req.user;
		}

		db.Budget.create({
				type: type,
				amount: amount,
				time: time,
				name: name,
				userid: user,
				period: period
			}).then(function(result) {
				res.json("complete");
			});
	});

	app.post("/api/budget", function(req,res,next){
		var user = req.user.userid;
		if (!user) {
			user = req.user;
		}
		var period = "monthly";
		var type = req.body.type;
		var amount = req.body.value;
		var name = req.body.title;

		db.Budget.create({
				type: type,
				amount: amount,
				period: period,
				name: name,
				userid: user
			}).then(function(result) {
				res.json("complete");
			});
	})

	app.get("/api/income", function(req,res,next) {
		var user = req.user.userid;
		if (!user) {
			user = req.user;
		}
		db.Budget.findAll({where: {userid: user}}).then(function(result) {
			res.json(result);
		});
	});

	app.put("/api/budget", function(req,res,next) {
		console.log("hello");
		var user = req.user.userid;
		var name = req.body.title;
		if (!name) {
			name = req.body.name;
		}
		var amount = req.body.value;
		if(!amount) {
			amount = req.body.amount;
		}
		var id = req.body.id;
		if (!user) {
			user = req.user;
		}
		db.Budget.update({
			name: name,
			amount: amount
		},
			{where: {userid: user, id: id}
		}).then(function(result) {
			res.json(result);
		}).catch(function(err) {
			if (err) {console.log(err)};
		})
	});

	app.delete("/api/budget/:id", function(req,res,next) {

		var user = req.user.userid;
		if (!user) {
			user = req.user;
		}
		var id = req.params.id;

		console.log(id);
		db.Budget.destroy( {where: {userid: user, id: id}
		}).then(function(result) {
			res.json(result);
		}).catch(function(err) {
			if (err) {console.log(err)};
		})
	});

	app.post("/api/transaction", function(req,res,next) {
		var user = req.user.userid;
		var item = req.body.item;
		var cost = req.body.cost;
		var category = req.body.category;
		var date = req.body.date;
		var subcategory = req.body.subcategory;
		var happy = req.body.happy;
		if (!user) {
			user = req.user;
		}

		db.Transaction.create({
				item: item,
				cost: cost,
				category: category,				
				transaction_date: date,
				subcategory: subcategory,
				happy: happy,
				username: user
			}).then(function(result,err) {
				if(err) {
					res.json(err)
				}


			})
	});

	app.put("/api/transaction", function(req,res,next) {
		var user = req.user.userid;
		var item = req.body.item;
		var id = req.body.id;
		var cost = req.body.cost;
		var category = req.body.category;
		var date = req.body.date;
		var subcategory = req.body.subcategory;
		var happy = req.body.happy;
		if (!user) {
			user = req.user;
		}
		db.Transaction.update({
			item: item,
			cost: cost
		},
			{where: {username: user, id: id}
		}).then(function(result) {
			res.json(result);
		}).catch(function(err) {
			if (err) {console.log(err)};
		})
	});

	app.delete("/api/transaction/:id", function(req,res,next) {
		var user = req.user.userid;
		if (!user) {
			user = req.user;
		}
		var id = req.params.id;
		db.Transaction.destroy( {where: {username
			: user, id: id}
		}).then(function(result) {
			res.json(result);
		}).catch(function(err) {
			if (err) {console.log(err)};
		})
	});

	app.get("/api/transaction/:date", function(req,res,next) {
		console.log("hfi");
		var user = req.user.userid;
		if (!user) {
			user = req.user;
		}
		var date = req.params.date;
		date = date.substring(0,8)
		date = new Date(date);
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		console.log(firstDay + lastDay);
		console.log(date);
		db.Transaction.findAll({where: {
			username: user,
			transaction_date: {
				$between: [firstDay, lastDay]
			}

		}}).then(function(result) {
			res.json(result);
		});
	})

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
					})
				})
		    });	
		});		
	});

	app.get("/login", passport.authenticate("local", {
		successRedirect: "/success",
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
	    res.redirect('/homepage')
	}
}

module.exports = routes;