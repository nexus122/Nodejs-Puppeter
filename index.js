/* 1. Cargamos librerias*/
const puppeteer = require('puppeteer');
const fs = require('fs');

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
    console.log("Nombre: ", name);
    fs.writeFile(`./json_traducidos/${name}`, json, (err) => {
        if (err) {
            console.error(err)
            return
        }
    });
}

// Funcion para esperar x tiempo con puppeter
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

/* Bucle de archivos */
for (var i = 0; i < ficheros.length; i++) {
    console.log("Iniciando la traducción del fichero: ", ficheros[i]);
    const text = require(`./jsons_pendentes_de_traduccion/${ficheros[i]}`);

    /* Array de textos no traducidos */
    let array_no_translated_texts = [];
    console.log("Fichero: ", ficheros[i], "Arrays: ", array_no_translated_texts);

    /* Funciones recursivas para leer jsons */
    function recursividad(json) {
        try {
            let keys = Object.keys(json);
            if (keys.length >= 1) {
                keys.forEach(key => {
                    if (typeof json[key] != "string") {
                        recursividad(json[key]);
                    }
                    else if (typeof json[key] == "string") {
                        // console.log("Introducimos en el array: ", json[key]);
                        array_no_translated_texts.push(json[key]);
                    }
                });
            }
        } catch (e) {}
    }

    /* Funcion de traducción recursiva*/
    let aux = 0;
    function traducciónRecursiva(json, translated_texts, id) {
        try {
            let keys = Object.keys(json);
            if (keys.length >= 1) {
                keys.forEach(key => {
                    if (typeof json[key] != "string") {
                        traducciónRecursiva(json[key], translated_texts, id);
                    } else {
                        console.log(`Traducción: ${ficheros[id]} ${translated_texts}`);
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

        let arr_translated_texts = [];

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.deepl.com/es/translator');

        for (let i = 0; i < texts.length; i++) {

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
            await delay(1500);

            // Esperamos al selector del textarea ya traducido
            await page.waitForSelector('.lmt__target_textarea');
            // Conseguimos el texto traducido
            let texto_traducido = await page.evaluate(() => document.querySelector(".lmt__target_textarea").value);

            // Insertamos el texto traducido en un array
            arr_translated_texts.push(texto_traducido);
        }

        await browser.close();
        return { texts: arr_translated_texts, id: id };
    };

    /* FUNCIONALIDADES */
    // Enviar a conseguir los textos

    recursividad(text);

    // Enviar textos para traducir
    traducir(array_no_translated_texts, i).then(function (data) {
        console.log("Buscador de textos finalizado");
        console.log("Se ha iniciado la traducción de los textos, por favor espere...")
        traducciónRecursiva(text, data.texts, data.id);
        console.log(ficheros[data.id - 1], data.id, (data.id - 1));
        escribirJson(JSON.stringify(text), ficheros[data.id]);
    });
}