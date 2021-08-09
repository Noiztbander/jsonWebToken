const { Router } = require("express");
const router = Router();
const userModel = require("../models/user");
const config = require("../config");
const jwt = require("jsonwebtoken");
const validateToken = require("../middlewares/verifyToken");

router.post("/login", async (req, res, next) => {
	const { email, password } = req.body;
  const user = await userModel.findOne({email:email});
	if(!user){
		return res.status(404).json({
			message: "The email doesn't exist"
		});
	}
	const passwordIsValid = await user.validatePassword(password);
	if(!passwordIsValid){
		return res.status(401).json({
			auth: false, token: null, message: "Wrong password"
		});
	} else {
		const token = jwt.sign({ id: user._id }, config.secret, {
			expiresIn: 60 * 60 * 24,
		});
		res.json({ auth: true, token: token });
	}
});

router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = new userModel({
    username: username,
    email: email,
    password: password,
  });

  // llamamos a la funcion que encripta la contraseña y la guardamos en su misma posicion.
  // ademas, como esa funcion toma tiempo, debemos convertirla en asincrona, ya que si no, nos devolveria su contraseña sin cifrar
  user.password = await user.encryptPassword(user.password);
  // con la funcion save guardamos el json creado anteriormente en la DB
  await user.save();

  // con este metodo sign, jsonwebtoken nos genera un token. Le podemos especificar cuanto tiempo durará activo.
  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 60 * 60 * 24,
  });

  res.json({ auth: true, token: token });
});

router.get("/profile", validateToken ,async (req, res, next) => {

	const user = await userModel.findById(req.userId, {password:0, __v:0});
	if(!user){
		return res.status(404).json({
			message: "No user found!"
		});
	} else {
		res.json(user);
	}

});

module.exports = router;
