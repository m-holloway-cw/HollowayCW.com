const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mustacheExpress = require("mustache-express");
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
var path = require('path');
var handlebars = require('handlebars');


var mailer = require('./mail');
var mongo = require('./mongoUtil');
var services = require('./services');

exports.app = app;

//session vars
var username;
var password;
var mailDomain;
var mailApiKey;

//setup mongoUtil
mongo.connectToServer( function( err, client ) {
  if (err) console.log(err);

  var dbo = mongo.getDb();
  setupServices(dbo);
});

function setupServices(dbo){
  dbo.collection("config").find().toArray(function(err, result) {
    if (err) throw err;
    username = result[0].user;
    password = result[0].pass;
    mailDomain = result[0].mailDomain;
    mailApiKey = result[0].mailGunApiKey;

  });
}

//method to check authoritzation
function checkAuth(req){
  if(req.session.username === 'raxa'){
    return 'admin';
  } else if (req.session.username){
    return 'normalUser';
  }else {
    return 'noAuth';
  }
}


app.engine('html', mustacheExpress());
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());
app.use(session({secret: 'EUypcWudV0leWN0df6QDoNGaGev6zY6p192y',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views');

var views = 0;

//page routes
app.get('/', function (req, res) {
if(checkAuth(req) === 'noAuth'){
  req.session.username = 'guest';
}
views++;
console.log('views logged:' + views);
  res.render('home');
});

app.get('/products', function(req, res){
  res.render('products');
});

app.get('/about', function(req, res){
  res.render('/about');
});

//contact form on page
app.post('/submitContact', async function(req, res){
  var data = req.body;
  var name = data.name;
  var email = data.email;
  var msg = data.message;
  try{
	await mailer.send(name, email, msg, mailDomain, mailGunApiKey).then(response => {
	if(response === "200 OK"){
	res.send("200");
	}
	else {
	console.log("Error");
	console.log(response);
	res.send("500");
}
});
  } catch(e) {
	console.log(e);
   };
});

app.get('/getProducts', function(req, res){
  var dbo = mongo.getDb();

  dbo.collection("products").find().toArray(function(err, result) {
    if (err) throw err;
    var products = new Array();
    var hGProducts = result[0].hGProducts;
    var diceProducts = result[1].diceProducts;
    products.push(hGProducts);
    products.push(diceProducts);
    res.send(products);
  });
});

// TODO: possible spot for product settings(add/remove/edit)
//admin stuff
app.get('/cave', function(req, res){
  if(checkAuth(req) === 'admin'){
    res.render('cave');
  } else {
    res.redirect('login');
  }
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res){
  console.log(req.body);
  if(req.body.username === username && req.body.password === password){
    req.session.username = req.body.username;
    res.send('admin');
  } else {
    req.session.username = 'guest';
    res.send('guest');
  }
});


app.get('/caveInfo', function(req, res){
  if(checkAuth(req) === 'admin'){
    console.log('begin info request')
    services.getCaveInfo(function(data){
      console.log(data);
      res.send(data);
    })
  } else {
    res.redirect('home');
  }
})

app.post('/cave', function(req, res){
  if(checkAuth(req) === 'admin'){
    services.handleCavePost(req.body, function(response){
      res.send(response);
    });
  } else {
    res.redirect('home');
  }
});


app.listen(8089, function () {
console.log('listening on 8089');
});
