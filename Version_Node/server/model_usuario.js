const mongoose = require('mongoose'),
 	  Schema = mongoose.Schema;

let UserSchema = new Schema({ 
  user: { type: String, required: true}, 
  email: { type: String, required: true, unique: true}, 
  password: { type: String, required: true},
 });

let UsuarioModel = mongoose.model('Usuario', UserSchema);

module.exports = UsuarioModel;