// HELPER DE SUBIR ARCHIVO 

// importaciones de terceros
const path = require('path'); // es para la carga de archivo - me trae la ruta
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject ) =>{ 


        const { archivo } = files; // si viene lo desestructuramos como archivo
        const nombreCortado = archivo.name.split('.'); // separamos el nombre en 2
        const extension = nombreCortado[ nombreCortado.length - 1]; // extraemos la última posición la extensión

        // Validar la extensión
        
        if ( !extensionesValidas.includes( extension ) ) { // si viene otra largo el error
            return reject( `La extension ${ extension } no es permitida - ${ extensionesValidas }`);
            }
        

        // cambiar el nombre por un id
        const nombreTemp = uuidv4() + '.' + extension; // concatenamos el id el punto y la extension

        // Grabar el archivo
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp ); // conformamos la ruta completa del guardado

        archivo.mv(uploadPath, (err) => { // Movemos el archivo a la ruta
        if (err) {  // si hay error mostramos lo siguinete
            reject (err);
        }

         resolve( nombreTemp )// si sale bien se resuleve la promesa y retornamos el uploadpath
       
        });

    });
}

module.exports = {
    subirArchivo
}