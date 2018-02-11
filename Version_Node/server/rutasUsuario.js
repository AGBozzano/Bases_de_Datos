const Router = require('express').Router();
const Usuario = require('./model_usuario.js');
const Evento = require('./model_evento.js');

//Metodo que busca y verifica la existencia de los Usuarios del sistema (Crearlos si no existen)
Router.get('/verificar_user', function(req, res) {
  Usuario.find({}, (err, usuarios) => {
    if (err) {
      return res.status(500).send({message: 'Error al intentar obtener los usuarios. (status:500)'})
    }else{

      if (usuarios.length <= 0) {
          //Insertar un nuevo Usuario de sistema 
          let new1 = new Usuario()
          new1.user = 'Alejandro Bozzano'
          new1.email = 'ale@gmail.com'
          new1.password = 'ale123'
          new1.save((err, usuario1) => {
            if (err) return res.status(500).send({message: 'Error al intentar insertar el usuario1. (status:500)'})
          })

          //Insertar un nuevo Usuario de sistema 
          let new2 = new Usuario()
          new2.user = 'Mia Bozzano'
          new2.email = 'mia@gmail.com'
          new2.password = 'mia123'
          new2.save((err, usuario2) => {
            if (err) return res.status(500).send({message: 'Error al intentar insertar el usuario2. (status:500)'})
          })     
      }else{
        return res.json(usuarios)
      } 
    } 
  })
})

//Metodo iniciar sesión
Router.post('/login', function(req, res) {
    let iemail = req.body.user,
    	  ipassword = req.body.pass,
    	  isess = req.session; 

    Usuario.find({email: iemail}).count({}, function(err, count) { 
        if(err){
            res.status(500)
            res.json(err) 
        }else{
          if(count == 1){ 
            Usuario.find({email:iemail, password:ipassword}).count({}, function(err, count) { 
                if (err) {
                    res.status(500) 
                    res.json(err) 
                }else{
                  if(count == 1){ 
                    isess.user = req.body.user;
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

Router.all('/', function(req, res) {
  return res.send({message: 'Error al intentar mostrar el recurso solicitado.'}).end()
})


//Exportar el modulo
module.exports = Router;












