var express = require('express');
var app = express();
var request = require('request');
var db = require('./models');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

//SET
app.set("view engine", "ejs");

//USE
app.use(session({
  secret: "secret",
  resave: false,
  save: {
    uninitialize: true
  }}));
app.use("/", function(req, res, next) {
    req.login = function(user) {
        req.session.userId = user.id;
    };
    req.currentUser = function() {
        return db.User.find(req.session.userId)
            .then(function(dbUser) {
                req.user = dbUser;
                return dbUser;
            });
    };
    req.logout = function() {
        req.session.userId = null;
        req.user = null;
    };
    next();});
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//GET
app.get('/', function(req, res) {
    res.render('articles/index')
});

app.get('/users/new', function(req, res) {
    res.render("users/new");
});

app.get('/sessions/new', function(req, res) {
    res.render("sessions/new");
});

app.get('/articles/index', function(req, res) {
    req.currentUser().then(function(dbUser) {
        if (dbUser) {
            db.FavoriteArticle.findAll({
                    where: {
                        UserId: dbUser.id
                    }
                })
                .then(function(articles) {
                    console.log("\n\n\n\n\nHELLO", articles);
                    res.render('favorites/index', {
                        ejsUser: dbUser,
                        idk: articles
                    });
                });
        } else {
            res.redirect('/sessions/new');
        }
    }); });

app.get('/articles/index', function(req,res){
      var article = req.query.id;
      var url = 'www.NYTAPI'+NYT;
      request(url, function(err, resp, body){
      if (!err && resp.statusCode === 200) {
      var articleData = JSON.parse(body);
      res.render("articles/index", {article: articleData});
        }
      });
      });

app.get('/articles/index',function(req,res){
  var articleSearch = req.query.search;
  if (!articleSearch) {
    res.render("articles/index", {articles: [], noarticles: true});
  } else {
    var url = "www.NYTAPI"+articleSearch;
    request(url, function(err, resp, body){
      console.log("working");
      if (!err && resp.statusCode === 200) {
        console.log("working 2");
        var jsonData = JSON.parse(body);
        if (!jsonData.Search) {
          res.render("articles/index", {articles: [], noArticles: true});
        }
        res.render("articles/index", {articles: jsonData.Search, noArticles: false});
      }
    });
  }});

app.get('/sessions/new', function(req,res){
        req.currentUser().then(function(user){
        if (user) {
        res.redirect('/favorites/index');
        } else {
        res.render("users/new");
        }
       });
       });

app.get('/favorites/index', function(req,res){
  req.currentUser().then(function(dbUser){
    if (dbUser) {
      db.FavoriteArticle.findAll({where: {UserId: dbUser.id}})
        .then(function(articles){
          console.log("\n\n\n\n\nworking", movies);
        res.render('favorites/index', {ejsUser: dbUser, idk: articles});
      });
    } else {
      res.redirect('/sessions/new');
    }
  });});

//POST
app.post('/users/new', function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  db.User.createSecure(email,password)
    .then(function(user){
      res.redirect('/favorites/index');
    });});

app.post('/sessions/new', function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  db.User.authenticate(email,password)
    .then(function(dbUser){
      if(dbUser) {
        req.login(dbUser);
        res.redirect('/favorites/index');
      } else {
        res.redirect('/articles/index');
      }
    });});

//DELETE
app.delete('/logout', function(req,res){
  req.logout();
  res.redirect('/sessions/new');});

app.listen(3000,function(){
  console.log("Now Listening");
})