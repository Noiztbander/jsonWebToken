const express = require ("express");
const app = express();
// para decirle a express que debe entender los formato Json
app.use(express.json());
// para hacer que express entienda los datos que le enviamos a traves de un formulario y lo convierte en un objecto de javascript
app.use(express.urlencoded({extended:false}));

app.use(require("./controllers/authController"));

module.exports = app;