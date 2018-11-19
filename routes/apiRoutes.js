// apiRoutes.js offers a set of routes for displaying and saving data to the db

// Dependencies

// Requiring our Post model
// This allows us to have access to all 
var db = require("../models");
var passport = require("../config/passport");

var cloudinary = require("cloudinary"),
    path = require('path'),
    fs = require('fs'),
    multer = require('multer')
   

    var storage = multer.diskStorage({
      filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
      }
    });

    var imageFilter = function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    }

    var upload = multer({storage: storage, fileFilter: imageFilter})

// cloudinary configuration
cloudinary.config({
  cloud_name: "barter-up",
  api_key: "467996483638436",
  api_secret: "SaI06VNIIv1xN27OD3RuuCrJ-LI"
});
// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/posts", function(req, res) {
    // Add sequelize code to find all posts, and return them to the user with res.json
    db.Post.findAll({}).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for retrieving a single post
  app.get("/api/posts/:id", function(req, res) {
    // Add sequelize code to find a single post where the id is equal to req.params.id,
    // return the result to the user with res.json
    db.Post.find({
      where: {
        id: req.params.id
      }
    })
    .then(function(dbPost) {
      res.json(dbPost);
    })
  });

  // POST route for saving a new post
  app.post("/api/post", upload.single('file'), function(req, res) {
    console.log(req.body);
    var img = req.file.path;
    var title = req.body.title;
    var description = req.body.description;
    var id = req.body.id;
    var fileAddress = '';
    var fileId = '';

    cloudinary.v2.uploader.upload(img, {folder: "posts/"},  function(error, result) {
      console.log("sent");
      console.log(result);
      fileAddress = result.secure_url;
      fileId = result.public_id;

      

      

    }).then(function() {
          console.log(title);
          console.log(description);
          console.log(fileId);
          console.log(fileAddress);
          console.log(id);

          db.Post.create({
            title: title,
            body: description,
            imageId: fileId,
            imageURL: fileAddress,
            UserId: id
          })
          .then(function() {
            res.redirect(307, "/api/login");
            
          })
          .catch(function(err) {
            res.json(err);
          });
ç
    });
    
    

    
  });

  


  // PUT route for updating posts
  app.put("/api/posts", function(req, res) {
    // Add code here to update a post using the values in req.body, where the id is equal to
    // req.body.id and return the result to the user using res.json
    db.Post.update({
      body: req.body.body,
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    })
      .catch(function(err) {
      // Whenever a validation or flag fails, an error is thrown
      // We can "catch" the error to prevent it from being "thrown", which could crash our node app
        res.json(err);
    });
  });

  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/userProfile");
  });

  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      lastName: req.body.lastName,
      firstName: req.body.firstName
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
}
