let Procedures = Object();
Procedures.init = async(msx)=>{
    let txt = String();
    let validateMsx = Boolean();
    validateMsx = await Procedures.ContienePalabra( msx, 'Hola');
    console.log("******VALIDANDO HOLA********", validateMsx)
    if( validateMsx === true ) return [
        "¡Hola Buen Día! Bienvenidos a la Tienda Virtual Lían Stylos",
        `
        01. Ver catalogó
        02. Hacer pedido
        03. ¡Chatear con un asesor!
        00. Volver al menú principal`
    ];
    validateMsx = await Procedures.ContienePalabra( msx, '1');
    console.log("******VALIDANDO HOLA********", validateMsx)
    if( validateMsx === true ) return [
        `
        04 Ver Catalogo de mujer
        05 Ver Catalogo de hombre
        00. Volver al menú principal
        `
    ];
    validateMsx = await Procedures.ContienePalabra( msx, '04');
    console.log("******VALIDANDO HOLA********", validateMsx)
    if( validateMsx === true ) return ['04'];
    return []
}
Procedures.ContienePalabra = async( descripcion, buscar )=>{
    let splitBuscar = buscar.split(" ");
    for(let i = 0; i < splitBuscar.length; i++){

        if(descripcion.toLowerCase().includes(splitBuscar[i].toLowerCase())) {
           return true;
        } 
        return false;
    }   
}
module.exports = Procedures;