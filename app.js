var db= require('./models'),
    express= require('express'),
    session= require('express-session'),
    bodyParser= require('body-parser'),
    methodOverride= require('method-override'),
    pg= require('pg'),
    ejs= require('ejs'),
    request= require('request'),
    app=express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(methodOverride("_method"));

app.get('/',function(req,res){
  res.render('articles/index')
});
app.get('/sessions/new',function(req,res){
  res.render("sessions/new")
});

app.post('/sessions/new',function(req,res){
  var email= req.body.email;
  var password =req.body.password;
db.User.createSecure(email,password)
.then(function(user){
  res.redirect('favorites/index');
})
})

app.listen(3000,function(){
  console.log("Now Listening");
})