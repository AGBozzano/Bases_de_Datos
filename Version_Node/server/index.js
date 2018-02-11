const http = require('http'),
	  express = require('express'),
	  mongoose = require('mongoose'),
	  bodyParser = require('body-parser'),
	  session = require('express-session'),
	  RutaUsuario = require('./rutasUsuario.js'),
	  RutaEvento = require('./rutasEvento.js');

const PORT = 8082;
const app = express();

const Server = http.createServer(app);

mongoose.connect('mongodb://localhost/agenda');

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