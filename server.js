require("dotenv").config();
var express = require("express");

var db = require("./models");
var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;


var app = express();
var PORT = process.env.PORT || 3000;

//Checks for user and password and confirms password is correct
passport.use(new Strategy(
  function(username, password, cb) {
    db.Users.findByUsername(email, function(err, email) {
      if (err) { return cb(err); }
      if (!email) { return cb(null, false); }
      if (email.password != password) { return cb(null, false); }
      return cb(null, email);
    });
}));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
//Needed for Passport
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
//Starting passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
