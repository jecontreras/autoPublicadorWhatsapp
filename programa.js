const { Client, LegacySessionAuth, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let countRequest = 0;
var browser = Object();
const mime = require('mime'); // npm install mime
const path = require('path');
const fs = require('fs');
let Procedures = Object();
let page;
let ipPc = 10;

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';
// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    puppeteer: {
        executablePath: '/usr/bin/brave-browser-stable',
    },
    authStrategy: new LocalAuth({
      clientId: "client-one"
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});

client.initialize(); 
ProcesoQR( false );
// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    console.log("*****", session)
    /*fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    })*/
});

client.on('message', async (message) => {
    //console.log("****", message )
    /*if(message.body === '!ping') {
        message.reply('pong');
        const chat = await message.getChat();
        const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
        chat.sendMessage(media);
    }*/
});
async function Inicial() {
    let resultado = Array();
    console.log("INIT Del Bloque ", new Date().toTimeString())
    await Procedures.sleep(10);
    while (true) {
        try {
            resultado = await Procedures.getMensajes(ipPc);
        } catch (error) {
            await Procedures.sleep(120);
            continue;
        }
        console.log("Cantidad de mensaje whatsapp=>>>>", resultado.length);
        for (let row of resultado) {
            await ProcesoQR( row );
            console.log(">>>>>>>>>>>>>>>>>>**Lista de todos los numeros completado****<<<<<<<<<<<<<<<<<<<<<<<<<<");
        }
        console.log(">>>>>>>>>>>>>>>>>>**Msx de watsapp completado****<<<<<<<<<<<<<<<<<<<<<<<<<<");
        await Procedures.sleep(180);
    }
}

async function ProcesoQR( row){
    return new Promise( async( resolve ) =>{
        client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrIP = qr;
            row.url = qr;
            qrcode.generate(qr, { small: true });
            if( row ) SubirImagen( row );
            resolve( true );
        });
        await ProcesoReady( row );
    })
}


async function ProcesoReady( row ){
    client.on("ready", async () => {
        console.log("WHATSAPP WEB => Ready");
        await ProcesoEn( row );
    });
}

async function ProcesoEn( row ){
    return new Promise( async( resolve ) =>{
        console.log("¨¨¨¨", row)
         //await Procedures.enviarFoto(row);
         let result = Object();
         try {
             result = await Procedures.getPlataformas(row.empresa, row.id, row.cantidadLista);
             console.log( "45645645445464",result );
             for (let item of result.listaMensaje) {
                 let countRotador = 0;
                 let countMsx = 0;
                 let count = 0;
                 for (let key of item.numerosPendientes) {
                     count++;
                     if (!result.mensaje) { console.error("Tenemos problemas con el get del mensaje"); break; }
                     if (countMsx >= result.mensaje.cantidadMsxPausa) { countMsx = 0; await Procedures.sleep(result.mensaje.tiempoMsxPausa || 30); }
                     console.log("lenght a enviar ", item.numerosPendientes.length);
                     let validandoPause = await Procedures.validandoPausa(result.mensaje);
                     let msx = await Procedures.validandoRotador(result.mensaje, countRotador);
                     let process = await Procedures.enviarWhatsapp(key, result.mensaje, msx);
                     process = await Procedures.validandoMsxEnviados(item, key);
                     process = await Procedures.actualizarEnviadorMsx(result.mensaje, count);
                     countMsx++;
                 }
                 console.log(">>>>>>>>>>>>>>>>>>**Lista de numeros completado****<<<<<<<<<<<<<<<<<<<<<<<<<<");
             }
         } catch (error) {
            console.log( "ERRORRRRr",error );
             resolve( false );
         }
         resolve( true );
    })
}

Procedures.getMensajes = async ( id )=>{
    let resultado = Array();
    resultado = await getURL('mensajes/querys', `{\"where\":{\"estado\":0, \"idPuesto\":${ id }, \"tipoEnvio\": 2, \"estadoActividad\": false },\"sort\":\"createdAt DESC\",\"page\":0,\"limit\":10}`, 'POST');
    if( !resultado ) return [];
    else return resultado.data;
}

Procedures.getPlataformas = async ( row, id = String, cantidadLista = 1 )=>{
    let resultado = await getURL('mensajes/getPlataformas', JSON.stringify({ url: row.urlConfirmacion, id: id, cantidadLista }), 'POST');
    // console.log("***", resultado)
    return resultado.data || { listaMensaje: [], mensaje: {} };
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


Procedures.validandoRotador = async( mensaje , index )=>{
    if( Object.keys( mensaje.listRotador ).length ===  0 ) return mensaje.descripcion;
    else {
        if( !mensaje.listRotador[index] ) { index = 0; return { text: mensaje.listRotador[index].mensajes, files: mensaje.listRotador[index].galeriaList }; }
        else return { text: mensaje.listRotador[index].mensaje, files: mensaje.listRotador[index].galeriaList };
    }
}

Procedures.enviarWhatsapp = async( dataUser, dataMensaje, msx )=>{
    try {
        console.log( "454546", dataUser, dataMensaje, msx)
        //console.log("url-------->>>>>", `https://web.whatsapp.com/send?phone=${ dataUser.telefono }&text=${ encodeURIComponent(`${ msx.text }`) }&source&data&app_absent`);
        await envioWhatsapp( client, dataUser.telefono, msx,dataMensaje );
        await Procedures.sleep( dataMensaje.cantidadTiempoMensaje || 15 );
        console.log("FINIX Enviado");
        return true;
    } catch (error) {
        console.error("Tenemos problemas en en viar el whatsapp", error);
        return true;
    }
}

Procedures.validandoMsxEnviados = async( dataMsx, numero )=>{
    dataMsx.numerosPendientes = dataMsx.numerosPendientes.filter( ( item )=> item.telefono !== numero.telefono );
    if( !dataMsx.numerosCompletados ) dataMsx.numerosCompletados = [];
    dataMsx.numerosCompletados.push( numero );
    await getURL('mensajesNumeros/'+dataMsx.id, JSON.stringify(dataMsx), 'PUT');
    console.log("=>>>>> Actualizado mensajesNumeros");
    return true;

}

Procedures.actualizarEnviadorMsx = async( mensaje, count )=>{
    await getURL('mensajes/' + mensaje.id, JSON.stringify({ cantidadEnviado: count }), 'PUT');
}

async function getURL(url, bodys, metodo) {
    var request = require('request');
    console.log("******************URL", url)
    return new Promise(resolve => {
        var options = {
            'method': metodo,
            'url': `https://socialmarketings.herokuapp.com/${url}`,
            //'url': `http://localhost:1138/${url}`,
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

Procedures.sleep = async (minutos) => {
    return new Promise(resolve => {
        setTimeout(async () => { resolve(true) }, minutos * 1000);
    });
}

async function envioWhatsapp( client, number, msx, dataMensaje ) {
    return new Promise( async ( resolve )=>{
        try {
        console.log('Client is ready!', dataMensaje );

        // Number where you want to send the message.
        //const number = "+573156027551";
        number = "+57" + number;
        // Your message.
        const text = msx.text || "Hola jose";
        let listImg = msx.files;
        if( !msx.files ) listImg = [];
        // Getting chatId from the number.
        // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
        console.log("DATA ENVIA", number, "TEXTO ENVIA", msx)
        const chatId = number.substring(1) + "@c.us";
        if( dataMensaje.listRotador[0] ){
            for( let row of dataMensaje.listRotador ){
                if( !row.galeriaList ) row.galeriaList = [];
                for( let key of row.galeriaList ){
                    const media = await MessageMedia.fromUrl( key.foto );
                    await client.sendMessage(chatId, media);
                }
                await client.sendMessage(chatId, row.mensajes );
            }
        }else{
            // Sending message.
           await client.sendMessage(chatId, text);
        }
            resolve( true );
        }catch(error){ console.log("******", error ); resolve( false ); }
    });
    
    
}

async function SubirImagen(row) {
    await getURL('mensajes/' + row.id, JSON.stringify({ imagenWhat: row.url }), 'PUT');
}

Inicial();
