const fs = require('fs');

/* Funciones globales */
// Lectura de directorio
function encontrar_ficheros_json(path) {
    let resp = fs.readdirSync(path, function (err, archivos) {
        if (err) {
            onError(err);
            return;
        }
        return archivos;
    });
    return resp;
}

// Escritura de nuevos jsons
function escribirJson(json, name) {
    //console.log("Nombre: ", name);
    fs.writeFile(`./json_traducidos/${name}`, json, (err) => {
        if (err) {
            console.error(err)
            return
        }
    });    
}

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
    "escribirJson": escribirJson,
    "delay": delay,
    "secondsToTime": secondsToTime,
    "tiempo_de_ejecucion": tiempo_de_ejecucion
}