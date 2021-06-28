// ARCHIVO PARA DEFINIR RUTAS DE USUARIOS

// Importaciones

const { Router } = require('express');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut,
        usuariosPatch,
        usuariosDelete } = require('../controllers/usuarios');

// Rutas 

const router = Router();

router.get('/', usuariosGet );

router.post('/', usuariosPost );

router.put('/:id', usuariosPut ); // requerimos un id

router.patch('/', usuariosPatch );

router.delete('/', usuariosDelete );

// Compartimos el módulo
module.exports = router;