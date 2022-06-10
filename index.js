const puppeteer = require('puppeteer');
const text = require("./pendente_de_traduccion/races.json");

let array_no_translated_texts = [];

/* Funciones */
function recursividad(json) {
    try {
        let keys = Object.keys(json);
        console.log(keys);
        if (keys.length >= 1) {
            keys.forEach(key => {
                //console.log("key: ", key);
                if (typeof json[key] != "string") {
                    recursividad(json[key]);
                } else {
                    console.log("key: ", key);
                    console.log("value: ", json[key]);
                    array_no_translated_texts.push(json[key]);
                }
            });
        }
    } catch (e) {
        console.log(e);
    }
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

/* Enviar a conseguir los textos */
recursividad(text);

/* Enviar textos para traducir */
traducir(array_no_translated_texts);

async function traducir(texts) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.deepl.com/es/translator');



    for (let i = 0; i < texts.length; i++) {

        let textarea_input = "lmt__source_textarea";
        //let textarea_output = "lmt__target_textarea";

        await page.waitForSelector(`.${textarea_input}`);
        await page.evaluate(() => document.querySelector(".lmt__source_textarea").value = "");
        await page.type(`.${textarea_input}`, texts[i]);
        await page.focus(`.${textarea_input}`);
        await page.keyboard.press(' ');

        await delay(2000);

        await page.waitForSelector('.lmt__target_textarea');
        let texto_traducido = await page.evaluate(() => document.querySelector(".lmt__target_textarea").value);
        console.log("Texto Traducido: ", texto_traducido);

        // await page.screenshot({ path: `./screenShoot/Foto_${i + 1}.png` });
    }

    await browser.close();
};