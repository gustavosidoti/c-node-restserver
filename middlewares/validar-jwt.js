const {response, request } = require('express');
const jwt = require('jsonwebtoken');

// importamos el modelo
const Usuario = require('../models/usuario');

const validarJWT = async ( req = request, res = response, next ) => {
    
    const token = req.header('x-token'); // como lo llamemos aquí el frontend tendrá que enviarlo

    // Si no mandan token
    if ( !token ) {
        return res.status(404).json({
            msg: 'No hay token en la petición'
        });
    }
    
    // Validar si es correcto el token enviado
    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); // verifica y extrae el uid del usuario que hace la eliminación

        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            });
        }

        // Verificar si el uid tiene estado true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado en false'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }


    
}


module.exports = {
    validarJWT
}