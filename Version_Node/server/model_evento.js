const mongoose = require('mongoose'),
 	  Schema = mongoose.Schema,
 	  Usuario = require('./model_usuario'),
 	  autoIncrement = require('mongoose-auto-increment');

let EventoSchema = new Schema({
  title: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: false },
  user: { type: Schema.ObjectId, ref: "Usuario" }
});

var connection = mongoose.createConnection("mongodb://localhost/agenda");
autoIncrement.initialize(connection);
EventoSchema.plugin(autoIncrement.plugin, {model: 'Evento', startAt: 1} ); 

let EventoModel = mongoose.model('Evento', EventoSchema);

module.exports = EventoModel;