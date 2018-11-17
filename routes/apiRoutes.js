// apiRoutes.js offers a set of routes for displaying and saving data to the db

// Dependencies

// Requiring our Post model
// This allows us to have access to all 
var db = require("../models");
var cloudinary = require("cloudinary"),
    path = require('path'),
    fs = require('fs'),
    multer = require('multer'),
   

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
module.exports = function(app) {


  // Get all examples
  app.get("/api/examples",  function(req, res) {
    db.Example.findAll().then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  app.get("/api/examples/:id", function(req, res) {
    
    var filesPath = path.join(__dirname, 'uploads/');
    fs.readdir(filesPath, function (err, files) {
        if (err) {
            console.log(err);
            return;
        }

        files.forEach(function (file) {
            fs.stat(filesPath + file, function (err, stats) {
                if (err) {
                    console.log(err);
                    return;
                }

                var createdAt = Date.parse(stats.ctime),
                    days = Math.round((Date.now() - createdAt) / (1000*60*60*24));

                if (days > 1) {
                    fs.unlink(filesPath + file);
                }
            });
        });
    });

    res.sendFile(path.join(__dirname, 'views/index.html'));
    


      db.Example.findOne({})

  });
// Routes
// =============================================================


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

  // Create a new post
  app.post("/api/posts", upload.single('file'), function (req, res)  {

    console.log(req.file.path);
    var img = req.file.path;
    var fileAddress = ''
    var fileId = '';

    cloudinary.v2.uploader.upload(img, {folder: "posts/"},  function(error, result) {
      console.log("sent");
      console.log(result);
      fileAddress = result.secure_url;
      fileId = result.public_id;

    });
      
    
  // POST route for saving a new post
 
    // Add sequelize code for creating a post using req.body,
    // then return the result using res.json
    db.Post.create({
      body: req.body.body,
      imageId: fileId,
      imageURL: fileAddress
    })
    .then(function(dbPost) {
      res.json(dbPost);
    })
    .catch(function(err) {
      res.json(err);
    });
    console.log(fileAddress);

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

};
