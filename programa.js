const puppeteer = require('puppeteer');
let countRequest = 0;
var browser = Object();
const mime = require('mime'); // npm install mime
const path = require('path');
const fs = require('fs');
let Procedures = Object();
let page;

async function Inicial(){
    let resultado = Array();
    console.log("INIT Del Bloque ", new Date().toTimeString())
    Procedures.levantandoNavegador();
    await Procedures.sleep( 10 );
    while( true ){
        try {
            resultado = await Procedures.getMensajes( 2 );
        } catch (error) {
            await Procedures.sleep( 120 );
            continue;
        }
        console.log("Cantidad de mensaje whatsapp=>>>>", resultado.length);
        for( let row of resultado ){
            await Procedures.enviarFoto( row );
            let result = Object();
            result = await Procedures.getPlataformas( row.empresa, row.id , row.cantidadLista );
            for( let item of result.listaMensaje ){
                let countRotador = 0;
                let countMsx = 0;
                let count = 0;
                for( let key of item.numerosPendientes ){
                    count++;
                    if( !result.mensaje ) { console.error( "Tenemos problemas con el get del mensaje" ); break;}
                    if( countMsx >= result.mensaje.cantidadMsxPausa ) { countMsx = 0; await Procedures.sleep( result.mensaje.tiempoMsxPausa || 30 ); }
                    await Procedures.validandCodigoWhat();
                    console.log("lenght a enviar ", item.numerosPendientes.length );
                    let validandoPause = await Procedures.validandoPausa( result.mensaje );
                    let msx = await Procedures.validandoRotador( result.mensaje, countRotador );
                    let process = await Procedures.enviarWhatsapp( key, result.mensaje, msx );
                    process = await Procedures.validandoMsxEnviados( item, key );
                    process = await Procedures.actualizarEnviadorMsx( result.mensaje,  count );
                    countMsx++;
                }
                console.log(">>>>>>>>>>>>>>>>>>**Lista de numeros completado****<<<<<<<<<<<<<<<<<<<<<<<<<<");
            }
            console.log(">>>>>>>>>>>>>>>>>>**Lista de todos los numeros completado****<<<<<<<<<<<<<<<<<<<<<<<<<<");
        }
        console.log(">>>>>>>>>>>>>>>>>>**Msx de watsapp completado****<<<<<<<<<<<<<<<<<<<<<<<<<<");
        await Procedures.sleep( 180 );
    }
}

Procedures.validandoPausa = async( data )=>{
    let respuesta = Boolean( false );
    for( let row of [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 ] ){
        let resultado = await Procedures.getMensajeNovedad( data.id );
        if( resultado.pausar == true ) { respuesta = true; break; }
        else { console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>**Pausado**<<<<<<<<<<<<<<<<<<<<<<<"); await Procedures.sleep( 15 );}
    }
    return respuesta;

}

Procedures.getMensajeNovedad = async( id )=>{
    let resultado = Array();
    resultado = await getURL('mensajes/querys', JSON.stringify({ where:{ id: id } }), 'POST');
    // console.log("********+++++++++", resultado, id);
    return resultado.data[0] || {};
}


Procedures.actualizarEnviadorMsx = async( mensaje, count )=>{
    await getURL('mensajes/' + mensaje.id, JSON.stringify({ cantidadEnviado: count }), 'PUT');
}

Procedures.validandoMsxEnviados = async( dataMsx, numero )=>{
    dataMsx.numerosPendientes = dataMsx.numerosPendientes.filter( ( item )=> item.telefono !== numero.telefono );
    if( !dataMsx.numerosCompletados ) dataMsx.numerosCompletados = [];
    dataMsx.numerosCompletados.push( numero );
    await getURL('mensajesNumeros/'+dataMsx.id, JSON.stringify(dataMsx), 'PUT');
    console.log("=>>>>> Actualizado mensajesNumeros");
    return true;

}

Procedures.enviarWhatsapp = async( dataUser, dataMensaje, msx )=>{
    const page2 = await browser.newPage();
    try {
        console.log("url-------->>>>>", `https://web.whatsapp.com/send?phone=57${ dataUser.telefono }&text=${ encodeURIComponent(`${ msx }`) }&source&data&app_absent`);
        await page2.goto(`https://web.whatsapp.com/send?phone=57${ dataUser.telefono }&text=${ encodeURIComponent(`Hola ${ dataUser.username } ${ msx }`) }&source&data&app_absent`);
        await Procedures.sleep( dataMensaje.cantidadTiempoMensaje || 15 );
        await page2.keyboard.press('Enter'); 
        console.log("FINIX Enviado");
        await Procedures.sleep( 5 );
        await page2.close();
        return true;
    } catch (error) {
        console.error("Tenemos problemas en en viar el whatsapp");
        return true;
    }
}


Procedures.validandoRotador = async( mensaje , index )=>{
    if( Object.keys( mensaje.listRotador ).length ===  0 ) return mensaje.descripcion;
    else {
        if( !mensaje.listRotador[index] ) { index = 0; return mensaje.listRotador[index].mensajes;}
        else return mensaje.listRotador[index].mensajes;
    }
}

Procedures.validandCodigoWhat = async()=>{
    return new Promise( resolve =>{
        let interval3 = setInterval(async() => {
            if (10 > countRequest) return false;
            clearInterval(interval3);
            resolve( true );
        },3000);
    });
}

Procedures.getPlataformas = async ( row, id = String, cantidadLista = 1 )=>{
    let resultado = await getURL('mensajes/getPlataformas', JSON.stringify({ url: row.urlConfirmacion, id: id, cantidadLista }), 'POST');
    // console.log("***", resultado)
    return resultado.data || { listaMensaje: [], mensaje: {} };
}

Procedures.enviarFoto = async( row )=>{
    try {
        let interval2 = setInterval(async () => {
            if (10 > countRequest){
                console.log("mandar foto =>>>>", countRequest)
                await page.screenshot({ path: 'example.png' });
                Procedures.SubirImagen(row);
            }else clearInterval( interval2 );
            }, 5000);   
    } catch (error) {
        console.error(">>>>>>>>>>>>>>>>>>>>***tenemos Problemas mandar la foto***<<<<<<<<<<<<<<<<<<<<<<")
    }
}

Procedures.SubirImagen = async ( row )=>{
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

Procedures.levantandoNavegador = async()=>{
    browser = await puppeteer.launch({ headless: false });
    //browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');
    page.on('request', request => countRequest++);
    return page;
}

Procedures.getMensajes = async ( id )=>{
    let resultado = Array();
    resultado = await getURL('mensajes/querys', `{\"where\":{\"estado\":0, \"idPuesto\":${ id }, \"tipoEnvio\": 2, \"estadoActividad\": false },\"sort\":\"createdAt DESC\",\"page\":0,\"limit\":10}`, 'POST');
    if( !resultado ) return [];
    else return resultado.data;
}

Procedures.sleep = async( minutos )=>{
    return new Promise(resolve => {
        setTimeout(async () => { resolve(true) }, minutos * 1000);
    });
}


Inicial();





async function getURL(url, bodys, metodo) {
    var request = require('request');
    console.log("******************URL", url)
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
          //detenerServer();
          resolve(false);
          //throw new Error(error);
        }
        try {
          // console.log(response.body);
          resolve(JSON.parse(response.body)); 
        } catch (error) {
          console.log(error);
          resolve(false);
        }
      });
    });
  }