// terceros
const { request, response } = require('express'); // lo desestructuramos para utilizar los res.
const bcryptjs = require('bcryptjs'); // para encriptar password


// propias
const Usuario = require('../models/usuario'); // la U es para crear instancias del modelo.


const usuariosGet = async (req = request, res = response) => { // el get de usuarios - traer

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }; // Almacenamos la instrucción de sólo activos en una constante

    const [total, usuarios] = await Promise.all([ //arreglo de promesas en simultaneo y desestructuración del resultado
        Usuario.countDocuments(query), // contamos registros activos
        Usuario.find(query)  // acá estan las especificaciones de paginación y activos
            .skip( Number( desde ) )
            .limit( Number( limite ))

    ]);

    res.json({
        total,
        usuarios
    });

}

const usuariosPost = async (req = request, res = response) => { // el post de usuarios - Agregar


   const { nombre, correo, password, rol } = req.body; // queremos atrapar esos datos
   const usuario = new Usuario({ nombre, correo, password, rol }); // creo una instancia del modelo de Usuario y le mandamos esos datos

   

   // Encriptar la contraseña
   const salt = bcryptjs.genSaltSync();
   usuario.password = bcryptjs.hashSync( password, salt); // estos son metodos de bcrypt
   
   
   // Guardar el usuario en BD
   await usuario.save();

    res.json({ // acá servimos la información 
        usuario
    });

}

const usuariosPut = async(req = request, res = response) => { // el put de usuarios

    const { id } = req.params; // extraemos el id de lo que envíe el usuario en la ruta.
    const { _id, password, google, correo, ...resto } = req.body; // separamos esos campos del body

    // TODO validar contra base de datos
    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt); // estos son metodos de bcrypt. lo hacemos si llega una de resto
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto); // metodo que busca por id y actualiza lo que trae el resto

    res.json({
        msg: 'put API - controlador',
        usuario
    });

}

const usuariosPatch = (req, res = response) => { // el get de usuarios

    res.json({
        msg: 'patch API - controlador'
    });

}

const usuariosDelete = async (req, res = response) => { // el get de usuarios

    const { id } = req.params; // rescatamos el id de lo que trae la búsqueda  
     
    // Borramos usuario actualizando su estado
    const usuario = await Usuario.findByIdAndUpdate( id, {estado:false } );
    
    res.json({
            usuario
        });

}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

}