const mongoose = require('mongoose'),
 	  Schema = mongoose.Schema;

let EventoSchema = new Schema({
  title: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: false },
  user: { type: Schema.ObjectId, ref: "Usuario" }
});

let EventoModel = mongoose.model('Evento', EventoSchema);

module.exports = EventoModel;