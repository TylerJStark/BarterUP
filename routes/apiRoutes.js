var db = require("../models");
var cloudinary = require("cloudinary"),
    path = require('path'),
    fs = require('fs'),
    multer = require('multer'),
    formidable = require('formidable'),
    readChunk = require('read-chunk'),
    fileType = require('file-type');

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
    


    db.Example.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new post
  app.post("/api/post", upload.single('file'), function (req, res)  {

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
    console.log(fileAddress);

    

   
   
    
  
});

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });


};
