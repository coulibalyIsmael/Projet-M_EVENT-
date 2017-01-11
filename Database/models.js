var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passwordHash = require('password-hash');
var gridfs = require('gridfs-stream');

var userSchema = mongoose.Schema({

    nom: String,
    prenoms: String,
    pays: String,
    email: String,
    status: String,
    motDePasse: String,
    categorie:[String],
    DateInscription:{type: Date, default: Date.now},
    dateDeNaissance: { type:Date},
    events:[{type: Schema.Types.ObjectId, ref: 'Event'}]

});

var eventSchema = mongoose.Schema({
    dateDebut: {type: Date},
    titre: String,
    description: String,
    categorie: String,
    prix: String,
    affiche: String,
    heureDebut: {type: Date},
    _createur: {type: Schema.ObjectId, ref:'User'},
    participant: [{type: Schema.Types.ObjectId, ref: 'User'}]


});

userSchema.methods.comparePassword = function (passw, cb) {
    if(passwordHash.verify(passw,this.motDePasse))
    {
        console.log(this.motDePasse,'--->',passw);
        cb(null, passwordHash.verify(passw,this.motDePasse));
    }
    else{
        return cb(null);
    }
};

var User = mongoose.model('User', userSchema);
var Event = mongoose.model('Event', eventSchema);

exports.User = User;
exports.Event  = Event;

