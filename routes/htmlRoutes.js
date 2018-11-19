// html-routes.js offers a set of routes for sending users to the various html pages

// Dependencies
var path = require("path");

var isAuthenticated = require("../config/middleware/isAuthenticated");


// Routes
module.exports = function(app) {

  
  // index route loads index.html
  app.get("/", function(req, res) {
   // If the user already has an account send them to the members page
   if (req.user) {
    res.redirect("/userProfile");
  }
  res.sendFile(path.join(__dirname, "../public/signuppage.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/userProfile");
    }
    res.sendFile(path.join(__dirname, "../public/loginpage.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/userProfile", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/userProfile.html"));
  });

  app.get("/search", function(req, res) {
    // If the user already has an account send them to the members page
    res.sendFile(path.join(__dirname, "../public/search.html"));
  });

  app.get("/about", function(req, res) {
    // If the user already has an account send them to the members page
    res.sendFile(path.join(__dirname, "../public/about.html"));
  });


};
