const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

// methods extiende el esquema para añadir procesos posteriores a su creacion
userSchema.methods.encryptPassword = async (password)=>{
	/* el metodo gensalt te encripta el string que le pases, el argumento
	que le añades, es el numero de veces que va a encriptar el string.
	Es un metodo asincrono, por eso usamos async/await */
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = function(receivedPassword){
	// compare, es el metodo que necesitamos para desencriptar la password y validarla
	return bcrypt.compare(receivedPassword, this.password);
};

module.exports = model("user", userSchema);
