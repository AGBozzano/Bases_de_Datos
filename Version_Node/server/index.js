const http = require('http'),
	  express = require('express'),
	  mongoose = require('mongoose'),
	  MongoClient = require('mongodb').MongoClient,
	  bodyParser = require('body-parser'),
	  session = require('express-session'),
	  RutaUsuario = require('./rutasUsuario.js'),
	  RutaEvento = require('./rutasEvento.js');


//mongoose.connect('mongodb://localhost/agenda');
connection = mongoose.connect('mongodb://localhost/agenda', function(error){//definir y establecer la base de datos a utilizar
	if(error){ //Verificar si existe error al conectarse a mongodb
		 console.log(error.name +" "+ error.message); //Mostrar mensaje de eror
	}else{
	  console.log('Conectado a MongoDB'); //Mostrar mensaje exitoso
	}
});

const PORT = 8082;
const app = express();

const Server = http.createServer(app);



app.use(express.static('../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({ 
    secret: 'secret-pass', 
    cookie: { maxAge: 3600000 }, 
    resave: false,
    saveUninitialized: true,
}));

app.use('/users',RutaUsuario);
app.use('/events',RutaEvento);

Server.listen(PORT, function(){
	console.log('Server is listening on port '+ PORT);
});