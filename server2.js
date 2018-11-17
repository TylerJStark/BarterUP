// Dependencies
var express = require("express");

// Create an instance of the express app.
var app = express();
var path = require("path");

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

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
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
