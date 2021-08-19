// ARCHIVO PARA DEFINIR RUTAS DE USUARIOS - LOGIN

// Importaciones de terceros

const { Router } = require('express');
const { check } = require('express-validator');

// importaciones internas

const { validarCampos } = require('../middlewares/validar-campos');
const { login, googleSignin } = require('../controllers/auth');

// código de este archivo

// Rutas

const router = Router();

router.post('/login', [  // tienen que venir esos datos en la petición
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login ); // llamada a ese controlador


router.post('/google', [ // tiene que venir el id_token
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
],googleSignin ); // llamamos a ese controlador

// EXPORTACIONES 
module.exports = router;
