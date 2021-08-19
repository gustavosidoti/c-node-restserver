//CONTROLADOR DE LA CARGA DE ARCHIVOS

// Importaciones de terceros
const { response } = require('express');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2  // IMPORTAMOS
cloudinary.config( process.env.CLOUDINARY_URL ); // configuramos nuestras credenciales.


// Importaciones propias
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');



const cargarArchivo = async (req, res = response) => {
      
        // imagenes
        try {
          // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos'  );
          const nombre = await subirArchivo( req.files, undefined, 'imgs'  ); // lo enviamos a el helper y nos devuelve el tratamiento
                                                                      // el undefined argumentos a fuerza - se guarda en la carpeta imgs
        
          res.json({
            nombre    // mostramos el nombre
          })
        } catch (error) {
            res.status(400).json({ msg })
        }
        
}

const actualizarImagen = async (req, res = response ) => {

    const { id, coleccion } = req.params; // Recibimos los parámetros

    let modelo;
    // DERMINAMOS SI ES IMAGEN DE PRODUCTO O USUARIO
    switch (coleccion) { // determinamos si se trata de un producto o un usuario
      case 'usuarios':
          modelo = await Usuario.findById(id); //asignamos el id del usuario
          if( !modelo ) { // revisamos si existe ese id de usuario
            return res.status(400).json({
              msg:`No existe un usuario con el id ${ id }`
            });
          }    
        break;

      case 'productos':
          modelo = await Producto.findById(id);
          if( !modelo ) {
            return res.status(400).json({
              msg:`No existe un Producto con el id ${ id }`
            });
          }  
        break;
    
      default:
          return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    // LIMPIAR IMAGENES PREVIAS
    try {
      if( modelo.img ){
          // Hay que borrar la imagen del servidor
          const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img ); // cargamos la ruta
          if (fs.existsSync( pathImagen ) ) { // si hay imagen en ese path la elimina
            fs.unlinkSync( pathImagen );
          }
      }
    } catch (error) {
      res.status(400).json({ msg })
    }
    
    
    // PREPARAMOS EL NOMBRE Y LA RUTA DE LA IMAGEN
    const nombre = await subirArchivo( req.files, undefined, coleccion  ); // llamamos al helper y pasamos la ruta
    modelo.img = nombre; // asignamos la imagen y la ruta a la pripiaedad imagen en el modelo 
 
    // GUARDAMOS EN BASE DE DATOS SEGÚN CORRESPONDA
    await modelo.save(); // la guardamos en Base de datos
   

    res.json({ modelo }); // Mostramos el modelo de producto o de usuario
}

const actualizarImagenCloudinary = async (req, res = response ) => {

  const { id, coleccion } = req.params; // Recibimos los parámetros

  let modelo;
  // DERMINAMOS SI ES IMAGEN DE PRODUCTO O USUARIO
  switch (coleccion) { // determinamos si se trata de un producto o un usuario
    case 'usuarios':
        modelo = await Usuario.findById(id); //asignamos el id del usuario
        if( !modelo ) { // revisamos si existe ese id de usuario
          return res.status(400).json({
            msg:`No existe un usuario con el id ${ id }`
          });
        }    
      break;

    case 'productos':
        modelo = await Producto.findById(id);
        if( !modelo ) {
          return res.status(400).json({
            msg:`No existe un Producto con el id ${ id }`
          });
        }  
      break;
  
    default:
        return res.status(500).json({msg: 'Se me olvidó validar esto'});
  }

  // LIMPIAR IMAGENES PREVIAS
      if( modelo.img ){  // si hay imagen previa
        const nombreArr     = modelo.img.split('/'); // guardamos la ruta separada por / nos queda un array
        const nombre        = nombreArr[ nombreArr.length -1 ]; // extraemos la última posición que es id de cloudinary
        const [public_id]   = nombre.split('.'); // nos interesa el nombre. descartamos la extension del archivo
        cloudinary.uploader.destroy( public_id ); // eliminamos de cloudinary la imagen pasandole el id de la imagen.
      }
  
  
  // PREPARAMOS EL NOMBRE Y SUBIMOS LA IMAGEN
  
    const { tempFilePath } = req.files.archivo // queremos solo el path de la imagen de archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); // subimos ese path a cloudinary.
    modelo.img = secure_url; // asignamos la imagen en la propiedad img del modelo 

  // GUARDAMOS EN EL MODELO
    await modelo.save();
 

  res.json( modelo ); // Mostramos el modelo de producto o de usuario
}

const mostrarImagen = async( req, res=response ) => {
  const { id, coleccion } = req.params; // Recibimos los parámetros

  let modelo;
  // DERMINAMOS SI ES IMAGEN DE PRODUCTO O USUARIO
  switch (coleccion) { // determinamos si se trata de un producto o un usuario
    case 'usuarios':
        modelo = await Usuario.findById(id); //asignamos el id del usuario
        if( !modelo ) { // revisamos si existe ese id de usuario
          return res.status(400).json({
            msg:`No existe un usuario con el id ${ id }`
          });
        }    
      break;

    case 'productos':
        modelo = await Producto.findById(id);
        if( !modelo ) {
          return res.status(400).json({
            msg:`No existe un Producto con el id ${ id }`
          });
        }  
      break;
  
    default:
        return res.status(500).json({msg: 'Se me olvidó validar esto'});
  }

  // LIMPIAR IMAGENES PREVIAS
  try {
    if( modelo.img ){
        
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img ); // cargamos la ruta
        if (fs.existsSync( pathImagen ) ) { // si hay imagen en ese path la elimina
          return res.sendFile( pathImagen ) // enviamos la imagen
        }
    }
  } catch (error) {
    res.status(400).json({ msg })
  }

  // SI NO HAY IMAGEN DE PRODUCTO O USUARIO PARA MOSTRAR
      const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
      res.sendFile( pathImagen );

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}