let Procedures = Object();
/*Procedures.init = async(msx)=>{
    let txt = String();
    let validateMsx = Boolean();
    validateMsx = await Procedures.ContienePalabra( msx, 'He visto esto en Facebook');
    console.log("******VALIDANDO HOLA********", validateMsx)
    if( validateMsx === true ) return [
        "¡Hola Buen Día! Bienvenidos a la Tienda Virtual @liam_stilos",
        `
        01. Ver catalogó!
        02. Hacer pedido!
        03. ¡Chatear con un asesor!
        00. Volver al menú principal!`
    ];
    /////////////////////////////////////////////////////////////////////////////////
    validateMsx = await Procedures.ContienePalabra( msx, 'hola');
    console.log("******VALIDANDO HOLA********", validateMsx)
    if( validateMsx === true ) return [
        "¡Hola Buen Día! Bienvenidos a la Tienda Virtual @liam_stilos",
        `
        01. Ver catalogó!
        02. Hacer pedido!
        03. ¡Chatear con un asesor!
        00. Volver al menú principal!`
    ];
    /////////////////////////////////////////////////////////////////////////////////
    validateMsx = await Procedures.ContienePalabra( msx, 'inicial');
    console.log("******VALIDANDO HOLA********", validateMsx)
    if( validateMsx === true ) return [
        "¡Hola Buen Día! Bienvenidos a la Tienda Virtual @liam_stilos",
        `
        01. *Ver catalogó!*
        02. *Hacer pedido!*
        03. *¡Chatear con un asesor!*
        00. *Volver al menú principal!*`
    ];
    /////////////////////////////////////////////////////////////////////////////////
    validateMsx = await Procedures.ContienePalabra( msx, '01');
    console.log("******VALIDANDO VER CATALOGO********", validateMsx)
    if( validateMsx === true ) return [
        `
        04 Ver Catalogo de Hombre
        05 Ver Catalogo de Mujer
        06 Ver Catalogo de Jean Hombre
        07 Ver Catalogo de Jean Mujer
        00. Volver al menú principal
        `
    ];
    /////////////////////////////////////////////////////////////////////////////////
    validateMsx = await Procedures.ContienePalabra( msx, '02');
    console.log("******VALIDANDO HACER PEDIDO********", validateMsx)
    if( validateMsx === true ) return [
        `
*Para el proceso de hacer pedido los requisitos son*
 1. Foto o modelo del producto interesado?
 2. Ciudad de Destino?
 3. Nombre de la persona a recibir?
 4. Talla interesado?
 5. ¿Direccion a recibir?
 6. ¿Telefono de quien lo recibe?



 ¡Nota! Una vez nos manda toda la información nosotros nos encargamos del proceso de validación de tu pedido y en breve te mandaremos el número de guía.

 Recuerda que todos nuestros envíos son dé forma *Gratuita*

 ¡Gracias por tu compra y por preferirnos Feliz día!
        `
    ];

    /////////////////////////////////////////////////////////////////////////////////
    validateMsx = await Procedures.ContienePalabra( msx, '04');
    console.log("******VALIDANDO ENVIANDO MENSAJES CATALOGO DE HOMBRE********", validateMsx)
    if( validateMsx === true ) return ['04'];
    /////////////////////////////////////////////////////////////////////////////////
    validateMsx = await Procedures.ContienePalabra( msx, '05');
    console.log("******VALIDANDO ENVIANDO MENSAJES CATALOGO DE MUJERES********", validateMsx)
    if( validateMsx === true ) return ['05'];
    /////////////////////////////////////////////////////////////////////////////////
    validateMsx = await Procedures.ContienePalabra( msx, '05');
    console.log("******VALIDANDO VOLVIENDO AL MENU PRINCIPAL********", validateMsx)
    if( validateMsx === true ) return [
        "¡Hola Buen Día! Bienvenidos a la Tienda Virtual @liam_stilos",
        `
        01. Ver catalogó
        02. Hacer pedido
        03. ¡Chatear con un asesor!
        00. Volver al menú principal`];
    /////////////////////////////////////////////////////////////////////////////////
    validateMsx = await Procedures.ContienePalabra( msx, '03');
    console.log("******VALIDANDO VA CHATEAR CON EL ASESOR********", validateMsx)
    if( validateMsx === true ) return ['Hola con gusto en unos minutos un asesor se comunica contigo ....'];
    return []
}*/

Procedures.init = async(msx, numero)=>{ 
    const texto = numero;
    let numeroSinPrefijo = texto.replace(/^57/, '');

    numeroSinPrefijo = ( numeroSinPrefijo.split("@") )[0];
    //console.log("Número sin prefijo:", numeroSinPrefijo);  // Salida: "3228576900"
    let dataLogic = await getNumeroInfo( numeroSinPrefijo );
    if( dataLogic.status === 400 ) return [];

    let txt = String();
    let validateMsx = Boolean();
    validateMsx = await Procedures.ContienePalabra( msx, dataLogic.listLogic );
    console.log("******VALIDANDO TODO********", validateMsx)
    if( validateMsx !== false ) {
        if( validateMsx.urlMedios ) return [ { 
            indicador: '04',
            data: validateMsx.urlMedios,
            dataEnd: validateMsx.respuesta
        } ]
        else return [ { data: validateMsx.respuesta } ];
    }

}
getNumeroInfo = async( numero )=>{
    let resultado = await getURL( 'whatsappInfo/querys', {
        numero: numero
    }, 'post' );
    let numeroId = String();
    try {
        resultado = resultado.data[0];
        numeroId = resultado.id;
    } catch (error) { 
        return { status: 400, data: "ID NUMERO ERROR"};
    }
    if( !numeroId ) return [];
    resultado = await getURL( 'InfoWhatsapp/querys', {
        numero: numeroId
    }, 'post' );
    try {
        resultado = resultado.data[0];
    } catch (error) {
        return { status: 400, data: "ERROR LOGICA"};
    }
    return resultado;
}

async function getURL(url, bodys, metodo) {
    var request = require('request');
    console.log("******************URL", url)
    bodys = JSON.stringify( bodys );
    return new Promise(resolve => {
        var options = {
            'method': metodo,
            'url': `https://whatsappapiweb.herokuapp.com/${url}`,
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
            //console.log( "result*********",response.body)
            try {
                //console.log(response.body);
                resolve(JSON.parse(response.body));
            } catch (error) {
                console.log(error);
                resolve(false);
            }
        });
    });
}

Procedures.validateFont = async( descripcion, buscar )=>{
    let splitBuscar = buscar.split(" ");
    for(let i = 0; i < splitBuscar.length; i++){

        if(descripcion.toLowerCase().includes(splitBuscar[i].toLowerCase())) {
           return true;
        } 
        return false;
    }   
}
Procedures.ContienePalabra = async( descripcion, buscar )=>{
    let validate = Boolean();
    for( let row of buscar ){
        validate = await Procedures.validateFont( descripcion, row.indicador );
        if( validate ) return row;
    }
    return false;
}
module.exports = Procedures;