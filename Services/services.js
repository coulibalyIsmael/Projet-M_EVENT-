var models  =  require("../Database/models");
var Q = require("q");
var passwordHash = require('password-hash');
var deferred = Q.defer();
var waterfall = require("async-waterfall");

exports.createUser = function(doc)
{
    
    var passwordHashed = passwordHash.generate(doc.motDePasse);
    var user = new models.User({nom: doc.nom,
     					prenoms: doc.prenoms,
    					email: doc.email, 
    					motDePasse: passwordHashed,
    					dateDeNaissance:doc.dateDeNaissance,
    					pays: doc.pays,
    					status: doc.status,
    				});
    user.save(function (err, user) {
  //if (err) return console.error(err);
     if(err) {return deferred.reject(new Error(JSON.stringify(err)));}
        else
        {console.log('resolie');
          return deferred.resolve(user);  
        }  

    });

    return deferred.promise;
       
  // Info.nom = user.nom;
  // Info.id = user.id;
  // Info.email = user.email;
  // Info.prenoms = user.prenoms;
  // console.log("--->",Info);
  // return Info;

};
// exports.insertFile = function(doc,gfs, req,resp){
//     var id = req.params.Id;
//     req.pipe(gfs.createWriteStream({_id: id, filename: 'image', mode:'w'}));
//     resp.send('intregrated');
//     //var imageInsert = gfs.createWriteStream({_is});
// };

exports.createEvent = function(doc)
{
    
    var event = new models.Event({titre: doc.titre,
                        description: doc.description,
                        prix: doc.prix, 
                        heureDebut: doc.heureDebut,
                        dateDebut: doc.dateDebut,
                        categorie: doc.categorie,
                        affiche: doc.files.file['_id'],
                        _createur: doc.idUser
                    });
    event.save(function (err, user) {
  if (err) return console.error(err);
  
});
    console.log("Ouais c'est bon");
};




// exports.createEvent = function(doc, gfs)
// {
    
//     var event = new models.Event({titre: doc.titre,
//                         description: doc.description,
//                         prix: doc.prix, 
//                         heureDebut: doc.heureDebut,
//                         dateDebut: doc.dateDebut,
//                         categorie: doc.categorie,
//                         affiche: doc.files.file['_id'],
//                         _createur: doc.idUser
//                     });
//     event.save(function (err, user) {
//   if (err) return console.error(err);
  
// });
//     console.log("Ouais c'est bon");
// };


exports.findEventByUserId = function(id){
    console.log(id,'-------');

    models.Event.find({_createur: id}, function(err, doc){
        if(err) {return deferred.reject(new Error(JSON.stringify(err)));}
        else
        {
          return deferred.resolve(doc);  
        }        
    });

    return deferred.promise;
       
};


exports.findAfficheBYId = function(id, gfs,resp){
    var bufs = [];
    var imageStream = gfs.createReadStream({_id: id});
    imageStream.on('error', function(error){
         resp.send('error');
    });
    imageStream.on('data', function(chunk){
        console.log(chunk);
            bufs.push(chunk);
    }).on('end', function(){
        var fbuf = Buffer.concat(bufs);
        var base64 = (fbuf.toString('base64'));
        resp.send({kl:base64});
    });
    
   //resp.write({'Content-type':'application/json'});
    //resp.setHeader('Content-type','image/*')
    
    //imageStream.pipe(resp);
};

exports.Events = function(id, gfs, resp){
 waterfall([
        function(callback){

        },

    ]);
};