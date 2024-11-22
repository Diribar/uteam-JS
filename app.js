"use strict";

// Obtiene las variables
const variables = require("./variables.js");
for (let metodo in variables) global[metodo] = variables[metodo];

global.express = require("express");
const app = express();
app.listen(80, () => console.log("Servidor funcionando..."));

app.set("view engine", "ejs"); // Terminación de los archivos de vista
app.set("views", ["./vistas"]);

app.use("/", require("./rutasContrs/ruta"));
