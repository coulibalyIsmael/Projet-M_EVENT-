var JwtStrategy = require('passport-jwt').Strategy;
var models = require('./Database/models');

var config = require('./Database/database'); //fichier de configuration de la base de données
 
module.exports = function(passport) {
  var opts = {};
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    models.User.findOne({id: jwt_payload.id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
            console.log(user);
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};