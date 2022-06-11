/* 1. Cargamos librerias*/
const puppeteer = require('puppeteer');
const funciones = require("./funciones.js");

/* Obtenemos la lista de ficheros del directorio */
let ficheros = funciones.leerDirectorio("./jsons_pendentes_de_traduccion");

/* Establecemos variables de configuración */
let lastTime; firstTime = Date.now();

/* Bucle de archivos da una vuelta por cada archivo que existe y ejecuta las recursividades. */
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
    let aux = 0; // Contador de recursividades para saber que texto estamos traduciendo
    function traducciónRecursiva(json, translated_texts, id) {
        try {
            let keys = Object.keys(json);
            if (keys.length >= 1) {
                keys.forEach(key => {
                    if (typeof json[key] != "string") {
                        //console.log("Intro:", json[key]);
                        traducciónRecursiva(json[key], translated_texts, id);
                    } else {
                        // console.log(`Traducción: ${ficheros[id]} ${translated_texts}`);
                        try {
                            translated_texts[aux] = translated_texts[aux].trim();
                        } catch (e) { }
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
        let total_texts = texts.length;
        console.log("Nº deTextos: ", total_texts);

        let sleep_time; // Tiempo que descansa el puppeter segun el nº de textos

        let inicio = 0;
        let final = 0;

        if(total_texts > 1000){
            final = 1000;
        }else{
            final = total_texts;
        }
        
        for (let z = 0; z < final; z++) {

            if(final > total_texts) break;
            
            console.log("------------------------------------------------------------------------------");
            console.log("Navegador Nº: ", (z+1), " Se reinicia cada: ", final," Lineas traducidas para evitar problemas de traduccion");

            if(z == 0){
                inicio = 0;
                final = final;
            }else{
                inicio = final;
                final = final + final;
            }                        

            /* Abrir el navegador */
            const browser = await puppeteer.launch();
            /* Abrir una nueva pagina */
            const page = await browser.newPage();

            /* Ir a Deepl  */
            await page.goto('https://www.deepl.com/es/translator');

            /* Hacemos un bucle en funcion de cada json. */
            for (let i = inicio; i < final; i++) {

                // Si el texto tiene menos de 4 palabras nos lo saltamos hasta el siguiente punto
                let largo;
                try{
                    largo = texts[i].length;
                }catch(e){
                    largo = 0;
                }
                if (largo <= 3) {
                    // Si el texto es demasiado corto no lo traducimos pero lo metemos en el array                
                    arr_translated_texts.push(text[i]);
                } else {
                    /* Si el largo es mayor de 3 y no es la palabra "age" podemos pasar */

                    if (id != 1 && id != 2) {
                        if (largo < 10) sleep_time = 800;
                        else if (largo < 100) sleep_time = 900;
                        else if (largo < 200) sleep_time = 1000;
                        else if (largo < 300) sleep_time = 1200;
                        else if (largo < 400) sleep_time = 1600;
                        else if (largo < 800) sleep_time = 2000;
                    }
                    
                    if(i == inicio) sleep_time = 2000 // La primera vez siempre tarda mas.                    

                    let textarea_input = ".lmt__source_textarea";
                    //let textarea_output = "lmt__target_textarea";

                    // Esperamos que exista el textarea
                    await page.waitForSelector(`${textarea_input}`);
                    // Vaciamos el texto
                    await page.evaluate(() => document.querySelector(".lmt__source_textarea").value = "");
                    // await page.screenshot({ path: `./screenShoots/${ficheros[id].replace(".json", "")}_${i}.png` });
                    // Escribimos el texto en ingles en el textarea
                    await page.type(`${textarea_input}`, texts[i]);
                    // Hacemos focus en el textarea
                    await page.focus(`${textarea_input}`);
                    // Pulsamos enter
                    await page.keyboard.press(' ');

                    // Esperamos x tiempo
                    await funciones.delay(sleep_time);

                    // Esperamos al selector del textarea ya traducido
                    await page.waitForSelector('.lmt__target_textarea');
                    // Conseguimos el texto traducido
                    let texto_traducido = await page.evaluate(() => document.querySelector(".lmt__target_textarea").value);

                    // Insertamos el texto traducido en un array                
                    console.log(`\x1b[31m  ${ficheros[id]} \x1b[0m -> ${((i * 100) / total_texts).toFixed(2)}%  \t CO: \x1b[33m${texts[i].length} - \x1b[0m ST: \x1b[33m${sleep_time}\x1b[0m \t   Num: \x1b[36m${(i+1)}\x1b[0m de \x1b[36m${total_texts}\x1b[0m ->  \t TT:  \x1b[32m${texto_traducido}\x1b[0m`);
                    arr_translated_texts.push(texto_traducido);
                }
            }
            await browser.close();
        }


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
        funciones.escribirJson(JSON.stringify(text), ficheros[data.id]);
    });
}