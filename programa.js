const puppeteer = require('puppeteer');
let countRequest = 0;
var browser = Object();
const mime = require('mime'); // npm install mime
const path = require('path');
const fs = require('fs');

async function start() {
  (async () => {
    // await sleep(50000);
    detenerServer();
  });

  browser = await puppeteer.launch({ headless: false });
  //browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://web.whatsapp.com');
  page.on('request', request => countRequest++);
  let interval = setInterval(async () => {
    //if (10 > countRequest) return false;
    clearInterval(interval);
    while (true) {
      console.log("INIT Del Bloque ", new Date().toTimeString())
      let resultado = await getURL('mensajes/querys', "{\"where\":{\"estado\":0, \"tipoEnvio\": 2, \"estadoActividad\": false },\"sort\":\"createdAt DESC\",\"page\":0,\"limit\":10}", 'POST');
      if (resultado) {
        console.log("Cantidad=>>>>", resultado.data.length)
        for (let row of resultado.data) {
          let interval2 = setInterval(async () => {
            console.log("mandar foto =>>>>", countRequest)
            if (10 > countRequest){
              await page.screenshot({ path: 'example.png' });
              SubirImagen(row);
            }
          }, 5000);
          let result = Object();
          // result = await getPlataformas(row.empresa);
          if (!row.emails) result = await getPlataformas(row.empresa);
          else result = await transformarTelefono(row);
          console.log("**", result)
          let JSONARREGLO = [];
          if (!result || Object.keys(result).length == 0) continue;
          for (let item of result.data) {
            let formato = Array();
            if (!row.emails) formato = await Formatiada(item);
            else formato = item;
            JSONARREGLO.push(formato);
          }
          console.log("**", JSONARREGLO.length)
          if (Object.keys(JSONARREGLO).length > 0) await nexProceso(JSONARREGLO, row)
          await getURL('mensajes/' + row.id, "{\"estadoActividad\": true }", 'PUT');
        }
      }
      await sleep(process.env.tiempo || 120);
      console.log("Fin Del Bloque ", new Date().toTimeString())
    }
  }, 3000);
}

async function transformarTelefono(item) {
  let lista = Array();
  let filtro = item.emails.split(",");
  for (let row of filtro) lista.push({ celular: row });
  return { data: lista };
}

async function sleep(segundos) {
  return new Promise(resolve => {
    setTimeout(async () => { resolve(true) }, segundos * 1000)
  })
}

async function detenerServer() {
  process.exit(0)
}

async function getURL(url, bodys, metodo) {
  var request = require('request');
  return new Promise(resolve => {
    var options = {
      'method': metodo,
      'url': `https://socialmarkert.herokuapp.com/${url}`,
      //'url': `http://localhost:1337/${url}`,
      'headers': {
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36',
        'Content-Type': ['application/json', 'text/plain'],
        'Origin': 'https://publihazclick.com',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://publihazclick.com/dashboard/home',
        'Accept-Language': 'es-US,es-419;q=0.9,es;q=0.8,en;q=0.7,und;q=0.6,pl;q=0.5,pt;q=0.4',
        'Cookie': 'sails.sid=s%3Aw0lxUqMLnAszWfE_sT9v0B1GIfBNmLwW.oR2AkvD7cWXQLism7%2ByQVA0muAkrD6uLlXt26Nl7lwk'
      },
      body: bodys

    };
    request(options, function (error, response) {
      if (error) {
        detenerServer();
        resolve(false);
        throw new Error(error);
      }
      try {
        // console.log(response.body);
        resolve(JSON.parse(response.body)); 
      } catch (error) {
        resolve(false);
      }
    });
  });
}

async function getPlataformas(row) {
  console.log("entre una")
  let resultado = await getURL('mensajes/getPlataformas', JSON.stringify({ url: row.urlConfirmacion }), 'POST');
  return resultado;
}

async function Formatiada(item) {
  if (item.lastname) return {
    name: item.name,
    lastname: item.lastname,
    celular: "57" + item.celular
  };
  else return {
    name: item.usu_nombre,
    lastname: item.usu_apellido,
    celular: (item.usu_indicativo || 57) + item.usu_telefono
  }
}

async function nexProceso(JSONARREGLO, mensaje) {
  let interval3 = setInterval(async() => {
    if (10 > countRequest) return false;
    // other actions...
    // await browser.close();
    clearInterval(interval3);
    for (let row of JSONARREGLO) {
      const page2 = await browser.newPage();
      console.log("url-------->>>>>", `https://web.whatsapp.com/send?phone=${row.celular}&text=Hola ${row.name || ''} ${mensaje.subtitulo} ${mensaje.descripcion}&source&data&app_absent`);
      await page2.goto(`https://web.whatsapp.com/send?phone=${row.celular}&text=Hola ${row.name || ''} ${mensaje.subtitulo} ${mensaje.descripcion}&source&data&app_absent`);
      await sleep(20);
      await page2.keyboard.press('Enter');
      console.log("FINIX");
      await sleep(2);
      await page2.close();
    }
  }, 3000)
}

async function SubirImagen(row) {
  let image_origial = "example.png";
  // path to the file we passed in
  const filepath = path.resolve(image_origial);
  // get the mimetype
  const filemime = mime.getType(filepath);
  fs.readFile(filepath, { encoding: 'base64' }, async (err, data) => {
    if (err) throw err;
    // console.log(`data:${filemime};base64,${data}`);
    let url = `data:${filemime};base64,${data}`;
    await getURL('mensajes/' + row.id, JSON.stringify({ imagenWhat: url }), 'PUT');
  });
}

start();