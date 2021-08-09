const jwt = require("jsonwebtoken");
const config = require("../config");

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      auth: false,
      messague: "No token provided",
    });
  }

  // verify, es un metodo de jsonwebtoken que te verifica un token creado. necesitamos pasarle el texto secret. Esto me devuelve el id que habiamos codificado anteriormente y me lo decodifica
  const decoded = jwt.verify(token, config.secret);

	// dentro de req, guardamos una nueva variable llamada userId y le añadimos el id. Es algo asi como una variable global guardada en los requests
	req.userId = decoded.id;
	next();
}

module.exports = verifyToken;
