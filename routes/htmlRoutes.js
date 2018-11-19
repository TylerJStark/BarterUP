// html-routes.js offers a set of routes for sending users to the various html pages

// Dependencies
var path = require("path");

// Routes
module.exports = function(app) {

  
  // search route loads search.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../search.html"));
  });

};
