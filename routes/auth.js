// ARCHIVO PARA DEFINIR RUTAS DE USUARIOS

// Importaciones de terceros

const { Router } = require('express');
const { check } = require('express-validator');

// importaciones internas

const { validarCampos } = require('../middlewares/validar-campos');
const { login } = require('../controllers/auth');

// código de este archivo

// Rutas

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

// EXPORTACIONES 
module.exports = router;
