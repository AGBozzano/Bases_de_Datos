const Router = require('express').Router();
const Usuario = require('./model_usuario.js');
const Evento = require('./model_evento.js');

// Obtener todos los eventos del usuario logueado
Router.get('/all', function(req, res) {
	req.session.reload(function(err) {
	  if(err){
	    res.send('logout');
	    res.end();
	  }else{
	    sesionDeUsuario = req.session.user;
      comsole.log(sesionDeUsuario);
        Evento.find({email: sesionDeUsuario}, (err, eventos) => {
          if (err) {
            return res.status(500).send({message: 'Error al intentar obtener los eventos. (status:500)'});
          }else{
            if (!eventos) {
              return res.status(404).send({message: 'No exiten eventos en la base de datos. (status:404)'});
            }else{
              res.json(eventos);
            } 
          } 
        })
	  }
	})
})

//Exportar el modulo
module.exports = Router;