# Nodejs-Puppeter-Json-Translator
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
- En ficheros muy largos a partir de la linea 8000 no traduce bien, quizas tiene que ver con el tamaño del array o con el navegador que abre puppeter, que despues de mucho tiempo se buguee y haya que reiniciarlo.

## ✔️ Por hacer
- [x] Ver como podemos reiniciar el navegador de puppeter
- [x] Refactorizar el codigo y hacerlo mas optimo
- [ ] Borrar un archivo de la capreta **jsons_pentientes_de_traduccion** al crear el archivo en **jsons_traducidos**
- [ ] Hacer un test con multiples jsons largos para ver cuales son las limitaciónes.