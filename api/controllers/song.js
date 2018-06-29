'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

/*function getSong(req, res){
    res.status(200).send({message: "Controlador cancion"});
}*/

function saveSong(req, res){
    var song = new Song();
    
    var params = req.body;
    song.number = req.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;
    
    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'Erro en el servidor'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'No se ha guardado la cancion'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });
}

function getSong(req, res){
    
    var songID = req.params.id;
    
    Song.findById(songID).populate({path: 'album'}).exec((err, song) => {
       if(err){
           res.status(500).send({message: 'Error en la peticion'});
       }else{
           if(!song){
               res.status(404).send({message: 'La canción no existe'});
           }else{
               res.status(200).send({song});
           }
       } 
    });
    
}

function getSongs(req, res){
    var songId = req.params.song;
    
    if(!songId){
        //Sacar todas las canciones de la bbdd
        var find = Song.find({}).sort('number');
    }else{
        //Sacar las canciones de un album concreto de la bbdd
        var find = Song.find({album: albumId}).sort('number');
    }
    
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!songs){
                res.status(404).send({message: 'No hay canciones'});
            }else{
                res.status(200).send({songs});
            }
        }
    }); 
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;
    
    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!songUpdated){
                res.status(404).send({message: 'No se ha actualizado la cancion'});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar la cancion'});
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'La cancion no ha sido eliminada'});
            }else{
                res.status(200).send({song: songRemoved});                        
            }
        }
    });

}

function uploadSong(req, res){
    var songId = req.params.id;
    var file_name = 'No subido...';
    
    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];
        
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        //console.log(ext_split);
        
        if(file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if(!songUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar'});
                }else{
                    res.status(200).send({song: songUpdated});
                }                     
            });
            
        }else{
            res.status(200).send({message: 'Extension no valida'});
        }
        
    }else{
        res.status(200).send({message: 'No has subido ninguna cancion...'});
    }
}

function getSongFile(req, res){
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/'+songFile;
    
    if(fs.existsSync('./uploads/songs/'+songFile)){
        res.sendFile(path.resolve(path_file));
    }else{
        res.status(200).send({message: 'No existe la cancion....'});
    }
}

module.exports = {
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadSong,
    getSongFile
}