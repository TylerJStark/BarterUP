var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // cms route loads cms.html
  app.get("/loggin", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/loggin.html"));
  });

  // blog route loads blog.html
  app.get("/signup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
};