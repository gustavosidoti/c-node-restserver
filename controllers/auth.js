// Importaciones de terceros
const { response } = require('express');
const bcryptjs = require('bcryptjs');

//Importaciones internas
const Usuario = require('../models/usuario');
const { generarJWT } = require('../middlewares/generar-jwt');


// código del archivo
const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el mail existe
        const usuario = await Usuario.findOne({ correo });
        
        if( !usuario) { // si no viene el usuario correcto
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });

        }

        // SI el usuario está activo

        if( !usuario.estado ) { // si el usuario está en false
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });

        }

        // Verificar la contraseña
        // esta funcion compara el pass recibido con el de la BD
        const validPassword = bcryptjs.compareSync( password, usuario.password);
        
        if( !validPassword ) { // si el validpassword está en false
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        // Devolver el OK de la respuesta

        res.json({ 
    
            usuario,
            token
        
        })
        
    } catch (error) {
        // Manejamos el error
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

// Exportaciones

module.exports = {
    login
}
