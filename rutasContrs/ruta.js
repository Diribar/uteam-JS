"use strict";

// Variables
const router = express.Router();
const contr = require("./controlador");

// Rutas
router.get("/", contr.inicio);
router.get("/ids-de-clientes", contr.idsClientes);
router.get("/ids-por-tax-number", contr.idsClientesPorTaxNumber);
router.get("/clientes-por-saldo", contr.nombresClientePorSaldo);
router.get("/bancos", contr.bancos);
router.get("/saldos-santander", contr.saldosSantander);
router.get("/ids-de-bancos", contr.idsDeBancos);
router.get("/clientes-exclusivos", contr.clientesExclusivos);
router.get("/cliente-con-menos-dinero", contr.clienteConMenosDinero);
router.get("/paso-ocho", contr.pasoOcho);

// Fin
module.exports = router;
