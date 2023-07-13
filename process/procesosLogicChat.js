let Procedures = Object();
Procedures.init = async(msx)=>{
    let txt = String();
    let validateMsx = Boolean();
    validateMsx = await Procedures.ContienePalabra( msx, 'Hola');
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
    validateMsx = await Procedures.ContienePalabra( msx, '01');
    console.log("******VALIDANDO VER CATALOGO********", validateMsx)
    if( validateMsx === true ) return [
        `
        04 Ver Catalogo de Hombre
        05 Ver Catalogo de Mujer
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
    validate = await Procedures.validateFont( descripcion, buscar );
    if( validate ) return validate;
    if( descripcion === '1') descripcion = '01';
    if( descripcion === '2') descripcion = '02';
    if( descripcion === '3') descripcion = '03';
    if( descripcion === '4') descripcion = '04';
    if( descripcion === '5') descripcion = '05';
    if( descripcion === '6') descripcion = '06';
    validate = await Procedures.validateFont( descripcion, buscar );
    return validate;
}
module.exports = Procedures;