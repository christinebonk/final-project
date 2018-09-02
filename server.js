var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var path = require("path");
var routes = require("./controllers/controllers.js");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var db = require("./models");

//authentication packages
var session = require("express-session");
var passport = require("passport");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'o1mQYsAjjBTalmA',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

routes(app);

db.sequelize.sync().then(function() {
  app.listen(port, function() {
    console.log("App listening on PORT " + port);
  });
});

