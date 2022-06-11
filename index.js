/* 1. Cargamos librerias*/
const puppeteer = require('puppeteer');
const fs = require('fs');
let firstTime = Date.now();
let lastTime;
let ficheros = leerDirectorio("./jsons_pendentes_de_traduccion");
console.log(ficheros);

/* Funciones globales */
// Lectura de directorio
function leerDirectorio(path) {
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
    lastTime = Date.now();
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

/* Bucle de archivos */
for (var b = 0; b < ficheros.length; b++) {
    console.log("Iniciando la traducción del fichero: ", ficheros[b]);
    const text = require(`./jsons_pendentes_de_traduccion/${ficheros[b]}`);

    /* Array de textos no traducidos */
    let array_no_translated_texts = [];
    //console.log("Fichero: ", ficheros[i], "Arrays: ", array_no_translated_texts);

    /* Funciones recursivas para leer jsons */
    function recursividad(json) {
        try {
            let keys = Object.keys(json);
            if (keys.length >= 1) {
                keys.forEach(key => {
                    if (typeof json[key] != "string") {
                        //console.log("Recursi: ", json[key]);
                        recursividad(json[key]);
                    }
                    else if (typeof json[key] == "string") {
                        //console.log("Intro: ", json[key]);
                        array_no_translated_texts.push(json[key]);
                    }
                });
            }
        } catch (e) { }
    }

    /* Funcion de traducción recursiva*/
    let aux = 0;
    function traducciónRecursiva(json, translated_texts, id) {
        try {
            let keys = Object.keys(json);
            if (keys.length >= 1) {
                keys.forEach(key => {
                    if (typeof json[key] != "string") {
                        //console.log("Intro:", json[key]);
                        traducciónRecursiva(json[key], translated_texts, id);
                    } else {
                        //console.log(`Traducción: ${ficheros[id]} ${translated_texts}`);
                        try{
                            translated_texts[aux] = translated_texts[aux].trim();
                        }catch(e){
                            translated_texts[aux] = translated_texts[aux];
                        }
                        json[key] = translated_texts[aux];
                        aux++;
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }


    /* Puppeter Traducción a la pagina   */
    async function traducir(texts, id) {
                
        let total_texts = texts.length;
        console.log("Textos por traducir totales: ", total_texts);
        let arr_translated_texts = [];
        let sleep_time = 1500;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.deepl.com/es/translator');

        for (let i = 0; i < texts.length; i++) {

            // Si el texto tiene menos de 4 palabras nos lo saltamos hasta el siguiente punto
            let largo = texts[i].length;
            if (largo <= 3 && texts[i].toLowerCase() != "age") {
                // Si el texto es demasiado corto no lo traducimos pero lo metemos en el array                
                arr_translated_texts.push(text[i]);
            } else {          
                
                if(i != 1 && i != 2){
                    if(largo < 10) sleep_time = 600;                    
                    else if(largo < 100) sleep_time = 700;
                    else if(largo < 200) sleep_time = 800;
                    else if(largo < 300) sleep_time = 1000;
                    else if(largo < 400) sleep_time = 1600;
                    else if(largo < 800) sleep_time = 2000;
                }
                
                let textarea_input = ".lmt__source_textarea";
                //let textarea_output = "lmt__target_textarea";

                // Esperamos que exista el textarea
                await page.waitForSelector(`${textarea_input}`);
                // Vaciamos el texto
                await page.evaluate(() => document.querySelector(".lmt__source_textarea").value = "");
                // Escribimos el texto en ingles en el textarea
                await page.type(`${textarea_input}`, texts[i]);
                // Hacemos focus en el textarea
                await page.focus(`${textarea_input}`);
                // Pulsamos enter
                await page.keyboard.press(' ');

                // Esperamos x tiempo
                await delay(sleep_time);                
                // Esperamos al selector del textarea ya traducido
                await page.waitForSelector('.lmt__target_textarea');
                // Conseguimos el texto traducido
                let texto_traducido = await page.evaluate(() => document.querySelector(".lmt__target_textarea").value);

                // Insertamos el texto traducido en un array                
                console.log(`\x1b[31m  ${ficheros[id]} \x1b[0m -> ${((i * 100)/total_texts).toFixed(2)}%  \t CO: \x1b[33m${texts[i].length} - \x1b[0m ST: \x1b[33m${sleep_time}\x1b[0m \t   Num: \x1b[36m${i}\x1b[0m de \x1b[36m${ total_texts }\x1b[0m ->  \t TT:  \x1b[32m${texto_traducido}\x1b[0m`);
                arr_translated_texts.push(texto_traducido);
            }
        }

        await browser.close();
        return { texts: arr_translated_texts, id: id };
    };

    /* FUNCIONALIDADES */
    // Enviar a conseguir los textos

    recursividad(text);

    // Enviar textos para traducir
    traducir(array_no_translated_texts, b).then(function (data) {
        console.log("Buscador de textos finalizado");
        console.log("Se ha iniciado la traducción de los textos, por favor espere...")
        traducciónRecursiva(text, data.texts, data.id);
        //console.log(ficheros[data.id - 1], data.id, (data.id - 1));
        escribirJson(JSON.stringify(text), ficheros[data.id]);
    });
}