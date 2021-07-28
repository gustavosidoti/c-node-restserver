// Importaciones de terceros
const { response } = require('express');
const bcryptjs = require('bcryptjs');

//Importaciones internas
const Usuario = require('../models/usuario');
const { generarJWT } = require('../middlewares/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


// código del archivo
// controlador del login tradicional
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

// controlador del login de google
const googleSignin = async(req, res=response) => {
       
    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo }); // revisa si hay un usuario con ese correo
        
        // Si el usuario no existe
        if( !usuario ){
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario ( data ); // creamos una nueva instancia de usuario
            await usuario.save(); // lo guardamos en BD
        }  

        // Si el usuario existe en BD pero está desactivado estado=falso
        if( !usuario.estado ) { // si el estado está en false
            return res.status(401).json({
                msg: 'Hable con el Administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        });
    } catch (error) {
        
        res.status(400).json({
            msg: 'Token de Google no es válido'
        });
    }
    
    
}

// Exportaciones de controladores

module.exports = {
    login,
    googleSignin
}
