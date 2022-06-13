# 📜 Traductor de JSONS con Node.js, Puppeter y DeepL
Proyecto para construir un traductor de jsons.
Pasos:
1. Recorrer el json y crear un array con los textos
2. Conectarse a una web de traducción y pasar los textos 1 a 1 creando un nuevo array con las traducciónes.
3. Recorrer el json e insertar las traducciónes 1 a 1

## 🚀 ¿Como hacerlo funcionar?
1. Clona el repositorio.
2. Abre una consola y escribe **npm install**.
3. Sube los archivos que quieras traducir a la carpeta **jsons_pendientes_de_traduccon**.
4. Ves a la consola y escribe **npm start**.
5. _Haz palomitas, esto puede ir bastante lento segun el tamaño del json y el numero de textos dentro._
6. En la consola aparecera cada frase que se va traduciendo, el fichero al que pertenece, por cual va y cuantas quedan, ademas del porcentaje de completado!
7. Poco a poco veras que se van creando ficheros .json en la carpeta **json_traducidos**.

## 🐛 Bugs
- Si se cargan muchos textos muy largos y el programa tarda mucho puede llegar a cortar o repetir textos
- Si se han traducido X numeros de textos (Bastante Alto) La web nos dice que hemos excedido el tiempo y nos hace esperar unas horas.

## ✔️ Por hacer
- [x] Ver como podemos reiniciar el navegador de puppeter
- [x] Refactorizar el codigo y hacerlo mas optimo
- [x] Hacer un test con multiples jsons largos para ver cuales son las limitaciónes.
    - Se recomienda no hacer mas de 4 jsons en paralelo.
- [x] Parametrizar si se quiere un log y/o ScreenShoots.
    - [x] Crear un Log escrito con todos los console.log para ver si hay errores.

## 🔝 Posibles mejoras
- [ ] Borrar un archivo de la capreta **jsons_pentientes_de_traduccion** al crear el archivo en **jsons_traducidos**
