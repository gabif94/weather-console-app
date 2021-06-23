const {
	leerInput,
	inquirerMenu,
	pausa,
	listarLugares,
} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
require('dotenv').config();

const main = async () => {
	const busquedas = new Busquedas();
	let opt;

	do {
		opt = await inquirerMenu();

		switch (opt) {
			case 1:
				const termino = await leerInput('Ciudad: ');
				const lugares = await busquedas.ciudad(termino);
				const idSeleccionado = await listarLugares(lugares);
				if (idSeleccionado === '0') continue;

				const lugarSeleccionado = lugares.find(l => l.id === idSeleccionado);

				busquedas.agregarHistorial(lugarSeleccionado.nombre);

				const clima = await busquedas.climaLugar(
					lugarSeleccionado.lat,
					lugarSeleccionado.lng
				);

				console.clear();
				console.log('\nInformación de la ciudad\n'.green);
				console.log('Ciudad: ', lugarSeleccionado.nombre);
				console.log('Lat: ', lugarSeleccionado.lat);
				console.log('Lon:', lugarSeleccionado.lng);
				console.log('Temperatura: ', clima.temp);
				console.log('Mínima: ', clima.min);
				console.log('Máxima: ', clima.max);
				console.log('Descripción: ', clima.descripcion.green);

				break;
			case 2:
				busquedas.HistorialCapitalizado.forEach((lugar, i) => {
					const idx = `${i + 1}.`.green;
					console.log(`${idx} ${lugar}`);
				});
				break;
		}

		if (opt !== 0) await pausa();
	} while (opt !== 0);
};

main();
