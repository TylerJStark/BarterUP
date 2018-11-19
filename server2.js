// Dependencies
var express = require("express");

// Create an instance of the express app.
var db = require("./models");

var app = express();
var path = require("path");
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;


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
// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
// Routes
require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

// Data
var userInfo = [
  { name: "raiana", email: "user@gmail.com" , awesomeness: 3 },
  { name: "lamia", email: "user@gmail.com", awesomeness: 8 },
  { name: "sam", email: "user@gmail.com", awesomeness: 1 },
  { name: "tylor", email: "user@gmail.com", awesomeness: 7 },
  { name: "jerry", email: "user@gmail.com", awesomeness: 2 },
  { name: "Tom", email: "user@gmail.com", awesomeness: 3 }
];

// Routes
app.get("/api/userProfile/:name?", function(req, res) {
  if (req.params.name != undefined) {
    for (var i = 0; i < userInfo.length; i++) {
      if (userInfo[i].name === req.params.name) {
        res.json([userInfo[i]]);
        break;
      }
    }
  } else {
    res.json(userInfo);
  }
});

app.get("/userProfile/:name", function(req, res) {
  res.sendFile(path.join(__dirname,"public/userProfile.html"));
  
});

// Start our server so that it can begin listening to client requests.
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

