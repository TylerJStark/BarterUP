var db = require("../models");
var passport = require('passport');

module.exports = function(app) {

  //Getting all posts from database
  app.get('/api/listings', function(req,res) {
    db.listings.findAll({
      where: query,
      include: [db.listings]
    }).then(function(dbPost) {           //Should work haven't tested
      res.json(dbPost);
    });
  }) 

  //See all users
  app.get('/api/users', function(req,res) {
      var listings = [];
      for (var i =0; i< res.length;i++){
        listings.push(res[i]);
      }
      return listings;
      //Needs to be done
  });

  //Push user credenitals to database
  app.post('/api/users', function(req,res) {
    db.users.create(req.body).then(function(users) {
      res.json(users);
    })
  });

  //Local User Authentification
  app.get('/',
  function(req, res) {
    res.render('index', { user: req.user });
  });

app.get('../loginpage',
  function(req, res){
    res.render('login');
  });
  
app.post('../loginpage', 
  passport.authenticate('local', { failureRedirect: '../loginpage' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });
};