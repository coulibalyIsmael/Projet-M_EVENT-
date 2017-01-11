var mongoDB = require('mongoose');
var model = require('./models');
var Grid = require('gridfs-stream');
var gfs = undefined;
var db = mongoDB.connect('mongodb://localhost/projet', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
    	 console.log('----------->'+gfs);
        console.log('connection successful');
    }
});
//var gfs = Grid(db, mongoDB);

exports.gfs = gfs;
exports.db = db;