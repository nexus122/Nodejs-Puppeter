const fs = require('fs');

/* Funciones globales */
// Lectura de directorio
function encontrar_ficheros_json(path) {

    let array_files = fs.readdirSync(path, function (err, archivo) {
        if (err) {
            onError(err);
            return;
        }

        return archivo;        

    });

    return array_files;

}

// Escritura de nuevos jsons
function escribir_json(json, name) {
    fs.writeFile(`./json_traducidos/${name}`, json, (err) => {
        if (err) {
            console.error(err)
            return
        }
    });    
}

/* Funcion que calcula el tiempo de ejecución */
function tiempo_de_ejecucion(firstTime) {
    let lastTime = Date.now();   
    console.log("Tiempo de ejecucion: ", secondsToTime(lastTime - firstTime));    
}

/* Traducir tiempo */
var secondsToTime = function (s) {

    function addZ(n) {
      return (n<10? '0':'') + n;
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs);
  }

// Funcion para esperar x tiempo con puppeter
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

module.exports = {
    "encontrar_ficheros_json": encontrar_ficheros_json,
    "escribir_json": escribir_json,
    "delay": delay,
    "secondsToTime": secondsToTime,
    "tiempo_de_ejecucion": tiempo_de_ejecucion
}