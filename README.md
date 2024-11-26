PRUEBA HABILIDADES JS

1. La prueba pide un algoritmo por método.
	- Me enfoqué en ello, dejando de lado generar vistas con formato. El resultado en todos los casos es una API que se ve en el navegador
	- El código de programación es Node.js más JavaScript.

2. Para ejecutar esta aplicación, se debe:
	- Tener instalado Node.js
	- Instalar las dependencias de node usadas en esta aplicación. Eso se realiza con el comendo: npm install
	- Ejecutar la aplicación. Eso se realiza con el comando: npm start
	- En el navegador web, usar el siguiente url: localhost. La aplicación muestra la vista principal

3. La aplicación consta de una vista principal, y una para cada resultado que se pida:
	- /, que es la vista principal. Muestra un listado de resultados posibles a pedir.
	- /<url-del-resultado-pedido>, que es una api con la información pedida.

4. Al elegirse un resultado en la vista principal, la aplicación abre una vista nueva con el resutlado pedido.

5. Particularidades:
	- Traté de enfocarme en que los resultados mostraran exactamente la información pedida. En algún caso, me pareció raro que me pidieran que los registros se ordenaran por algún campo, que en los resultados no me pedían que figurase, como para verificar que el orden estuviera bien. En esos casos, escribí en la programación, cómo sería el código para que ese campo de orden se viera, por las dudas que las instrucciones hubieran querido decir que se muestren. Usando ese código se pueden ver los campos de orden, no pedidos en el resultado.
	- En el punto 8, me piden agregar un nuevo cliente para mostrar en el resultado. El criterio que usé fue crearlo sólo para ese resultado, sin cambiar los registros de la base de datos. De esa manera, el cliente agregado, de nombre 'Juana Palmera', se ve solamente en el punto 8.
