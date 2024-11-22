"use strict";

module.exports = {
	inicio: (req, res) => res.render("vistaGral", {opciones}),

	// 0 Arreglo con los ids de clientes
	idsClientes: (req, res) => {
		const ids = clients.map((n) => n.id);
		return res.send(ids);
	},

	// 1 Arreglo con los ids de clientes ordenados por rut (¿taxNumber?)
	idsClientesPorTaxNumber: (req, res) => {
		// Obtiene el resultado
		const resultado = [...clients]
			.sort((a, b) => (a.taxNumber < b.taxNumber ? -1 : 1)) // los ordena por taxNumber
			.map((n) => ({id: n.id, taxNumber: n.taxNumber})); // se deja visible el valor del taxNumber, para validar el orden
		// .map((n) => n.id); // esta línea sirve para dejar sólo el id

		// Fin
		return res.send(resultado);
	},

	// 2 Arreglo con los nombres de cliente ordenados de mayor a menor por la suma TOTAL de los saldos de cada cliente en los bancos que participa.
	nombresClientePorSaldo: (req, res) => {
		// Variables
		const resultado = FN_saldosPorCliente(clients, accounts) // obtiene el saldo por cliente
			.map((n) => ({nombre: n.name, saldoTotal: n.saldoTotal})); // deja la info necesaria

		// Muestra el resultado
		return res.send(resultado);
	},

	// 3 Objeto en que
	// las claves sean los nombres de los bancos y
	// los valores (sean) un arreglo con los ruts (¿taxNumber?) de sus clientes ordenados alfabeticamente por nombre
	bancos: (req, res) => {
		// Variables
		const bancos = {};

		// Rutina por banco
		for (let bank of banks) {
			// Variables
			const clientes_id = accounts.filter((n) => n.bankId == bank.id).map((n) => n.clientId);
			const clientesDelBanco = clients.filter((n) => clientes_id.includes(n.id));
			const clientesOrdenadosPorNombre = clientesDelBanco.sort((a, b) => (a.name < b.name ? -1 : 1));
			const infoNecesaria = clientesOrdenadosPorNombre.map((n) => ({nombre: n.name, taxNumber: n.taxNumber})); // dejamos el método 'nombre' para que se pueda ver el criterio de ordenamiento

			// Al método 'nombre del banco', le agrega el array de los clientes ordenados por nombre
			bancos[bank.name] = infoNecesaria;
		}

		// Fin
		return res.send(bancos);
	},

	// 4 Arreglo
	// con los saldos de clientes
	// que tengan más de 25.000
	// en el Banco SANTANDER
	// ordenado decrecientemente
	saldosSantander: (req, res) => {
		// Obtiene las cuentas del banco Santader
		const bancoSantader = banks.find((n) => n.name == "SANTANDER");
		const cuentasSantander = accounts.filter((n) => n.bankId == bancoSantader.id);

		// Obtiene los clientes con su saldo en ese banco
		const clientes = FN_saldosPorCliente(clients, cuentasSantander) // obtiene el saldo por cliente en ese banco
			.filter((n) => n.saldoTotal > 25000) // deja sólo los casos superiores a 25K
			.map((n) => n.saldoTotal); // deja sólo el valor de los saldos

		// Fin
		return res.send(clientes);
	},

	// 5 Arreglo con ids de bancos
	// ordenados crecientemente por la cantidad TOTAL de dinero que administran.
	idsDeBancos: (req, res) => {
		// Variables
		const bancos = JSON.parse(JSON.stringify(banks)); // debe hacerse así para no afectar la variable original

		// Obtiene el balance consolidado por banco
		bancos.forEach((banco, i) => {
			const balancesDelBanco = accounts.filter((n) => n.bankId == banco.id).map((n) => n.balance); // obtiene el balance de todas las cuentas del banco
			const balanceConsolidado = balancesDelBanco.reduce((acum, n) => acum + n, 0); // consolida los balances en un único valor
			bancos[i].balanceCons = balanceConsolidado;
		});

		// Orden ascendente
		bancos.sort((a, b) => a.balanceCons - b.balanceCons);

		// Sólo los id
		const resultado = bancos.map((n) => n.id);
		// const resultado = bancos.map((n) => ({id: n.id, balanceCons: n.balanceCons})); // con este método se verifica el orden del 'balanceCons'

		// Fin
		return res.send(resultado);
	},

	// 6 Objeto en que las claves sean los nombres de los bancos
	// y los valores el número de clientes que solo tengan cuentas en ese banco.
	clientesExclusivos: (req, res) => {
		// Obtiene las cuentas de clientes exclusivos de un banco
		let clientesExclusivos = [];
		for (let account of accounts) {
			const tieneCuentaEnOtroBanco = accounts.find((n) => n.clientId == account.clientId && n.bankId != account.bankId); // averigua si el cliente de una cuenta tienen cuenta en otro banco
			const clienteYaIncluido = clientesExclusivos.find((n) => n.clientId == account.clientId); // averigua si ya está incluido en el resultado
			if (!tieneCuentaEnOtroBanco && !clienteYaIncluido) clientesExclusivos.push(account);
		}

		// Rutina por banco
		const bancos = {};
		for (let bank of banks) {
			const clientesDelBanco = clientesExclusivos.filter((n) => n.bankId == bank.id);
			bancos[bank.name] = clientesDelBanco.length;
			// bancos[bank.name] = clientesDelBanco.map((n) => n.clientId); // con esta línea en vez de la anterior, se pueden ver los ids de los clientes
		}

		// Fin
		return res.send(bancos);
	},

	// 7 Objeto en que las claves sean los nombres de los bancos
	// y los valores el id de su cliente con menos dinero.
	clienteConMenosDinero: (req, res) => {
		let bancos = {};
		for (let bank of banks) {
			// Deja solamente las cuentas del banco
			const cuentasDelBanco = accounts.filter((n) => n.bankId == bank.id);

			// Array con saldos por clientes de ese banco, deja solamente los clientes con saldo
			const saldosPorCliente = FN_saldosPorCliente(clients, cuentasDelBanco).filter((n) => n.saldoTotal);

			// Obtiene el menor saldo
			bancos[bank.name] = saldosPorCliente[saldosPorCliente.length - 1];
		}

		// Fin
		return res.send(bancos);
	},

	// 8 Agregar nuevo cliente con datos ficticios a "clientes"
	// y agregar una cuenta en el BANCO ESTADO con un saldo de 9000 para este nuevo empleado.
	// Luego devolver el lugar que ocupa este cliente en el ranking de la pregunta 2
	pasoOcho: (req, res) => {
		// Agrega un nuevo cliente con datos ficticios a "clientes"
		let clientes = [...clients];
		clientes.push({id: 7, taxNumber: "12345678", name: "JUANA PALMERA"});

		// Agrega una cuenta en el BANCO ESTADO con un saldo de 9000 para este nuevo empleado.
		let cuentas = [...accounts];
		cuentas.push({clientId: 7, bankId: 3, balance: 9000}); // de esta manera no se afecta la variable original

		// Obtiene el saldo por cliente sin importar el banco
		const resultado = FN_saldosPorCliente(clientes, cuentas) // Obtiene el saldo por cliente
			.map((n) => ({nombre: n.name, saldoTotal: n.saldoTotal})); // deja la info necesaria

		// Muestra el resultado
		return res.send(resultado);
	},
};

const FN_saldosPorCliente = (clientes, cuentas) => {
	// Clona variables para no afectar la original (la consulta 7 falla si no se usa esto)
	clientes = JSON.parse(JSON.stringify(clientes));
	cuentas = JSON.parse(JSON.stringify(cuentas));

	// Agrega el saldo al listado de clientes
	clientes.forEach((cliente, i) => {
		let balancesPorCliente = cuentas.filter((n) => n.clientId == cliente.id).map((n) => n.balance);
		let balanceConsolidado = balancesPorCliente.reduce((acum, n) => acum + n, 0);
		clientes[i].saldoTotal = balanceConsolidado;
	});

	// Ordena los clientes por su saldo
	clientes.sort((a, b) => b.saldoTotal - a.saldoTotal);

	// Fin
	return clientes;
};
