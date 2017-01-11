var express = require('express');
var app = express();
var http = require('http');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var database = require('./Database/app');
var Services = require('./Services/services');
var fs = require('fs');
var busboy = require('connect-busboy');
var emb = require('express-mongo-busboy')({mongoose:mongoose});
var Q = require('q');
var passwordHash  = require("password-hash");
//Pour l'authentification de l'utilisateur
var morgan = require('morgan');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var jwt         = require('jwt-simple');
var config = require('./Database/database');

//concetion à la base donnée
var mongoDB = require('mongoose');
var models  =  require("./Database/models");
var GridFs = require('gridfs-stream');
GridFs.mongo = mongoDB.mongo;
mongoDB.connect('mongodb://localhost/projet');
var conn = mongoDB.connection;
conn.once('open', function(){
  console.log('open');
 
});
var async = require('async-waterfall');

 var gridfs = GridFs(conn.db);

app.use(express.static(__dirname+'/accueil'));
app.use(bodyParser.json());
app.use(busboy({immediate: true}));

//gestion du CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,Authorization,X-Requested-With, Content-Type, Accept");
  next();
});


//initialistion des dependances à utiliser dans le code
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(morgan('dev'));
//initialisation du module passport et du module de session
app.use(passport.initialize());
app.use(passport.session());



app.get('/accueil', function(req, resp){

	console.log("got a request");
});


app.post('/inscription',function(req, resp){
  var user = {};
  user.email = req.body.email;
  user.password = req.body.motDePasse;

    console.log('recu',req.body.status);
  
 Services.createUser(req.body).then(function(res){
  console.log(res);
  var token = jwt.encode(user, config.secret); 
   resp.json({success: true, token: 'JWT ' + token, id:res._id,nom:res.nom,prenom:res.prenoms}); 
 },
 function(err){
  console.log('error');
 }
 );

    
    
  
  

});
app.post('/events/ajouter',emb,function(req, resp){
	console.log(req.body.files);
  console.log(req.body);
  Services.createEvent(req.body, resp);
});

//
app.get('/events/:Id', function(req, resp){
  

  Services.findEventByUserId(req.params.Id).then(function(res){
    resp.send(res);
  }, function(err){
    resp.send(new Error(JSON.stringify(err)));

  });  

});

app.get('/events/image/:Id', function(req, resp){
  console.log(req.params.Id);
  Services.findAfficheBYId (req.params.Id, gridfs, resp);

});


app.post('/userAuth', function(req, res) {
	console.log(req.body);
  models.User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: "L'authentification a échoué"});
    } else {
      
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          
          var token = jwt.encode(user, config.secret);
          
          res.json({success: true, token: 'JWT ' + token,id:user._id,nom:user.nom,prenom:user.prenoms});
        } else {
          res.send({success: false, msg: "L'authentification a échoué mauvais mot de passe"});
        }
      });
    }
  });
});

app.get('/userInfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentification a échoué utilisateur non trouvé'});
        } else {
          res.json({success: true, msg: 'Connected ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Pas de Token fourni'});
  }
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};



//app.listen(5000);
app.listen(5000,'192.168.43.192');
console.log("connected to the server");