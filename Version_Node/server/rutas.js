const Router=require('express').Router();
const Usuario = require('./model_usuario.js');
const Evento = require('./model_evento.js');

// Obtener todos los eventos del usuario logueado
RouterEventos.get('/all', function(req, res) {
	req.session.reload(function(err) {
	  if(err){
	    res.send('logout')
	    res.end()
	  }else{
	    sesionDeUsuario = req.session.id_usuario
        Evento.find({user: sesionDeUsuario}, (err, eventos) => {
          if (err) {
            return res.status(500).send({message: 'Error al intentar obtener los eventos. (status:500)'})
          }else{
            if (!eventos) {
              return res.status(404).send({message: 'No exiten eventos en la base de datos. (status:404)'})
            }else{
              res.json(eventos)
            } 
          } 
        })
	  }
	})
})

//Metodo iniciar sesión
Router.post('/login', function(req, res) {
    let user = req.body.user,
    	password = req.body.pass,
    	sess = req.session; 

    Usuarios.find({user: user}).count({}, function(err, count) { 
        if (err) {
            res.status(500)
            res.json(err) /
        }else{
          if(count == 1){ 
            Usuarios.find({user: user, password: password }).count({}, function(err, count) { 
                if (err) {
                    res.status(500) 
                    res.json(err) 
                }else{
                  if(count == 1){ 
                    sess.user = req.body.user; 
                    res.send("Validado");
                  }else{ 
                    res.send("Contraseña incorrecta"); 
                  }
                }
            })
          }else{
            res.send("Usuario no registrado"); 
          }
        }

    })
})

//Metodo cerrar sesión
Router.post('/logout', function(req, res) {
	req.session.destroy(function(err) {
	  if (err) {
	    return res.status(500).send({message: 'Error al intentar cerrar la sesión. (status:500)'})
	  }else{
	    req.session = null
	    res.send('logout')
	    res.end()
	  }
	})
})  

//Exportar el modulo
module.exports = Router;












  Router.all('/', function(req, res) {
    return res.send({message: 'Error al intentar mostrar el recurso solicitado.'}).end()
  })
