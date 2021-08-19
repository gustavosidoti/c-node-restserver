// ARCHIVO PARA DEFINIR LA CARGA DE ARCHIVOS - RUTAS

// Importaciones de terceros

const { Router } = require('express');
const { check } = require('express-validator');

// importaciones internas

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

// código de este archivo

// Rutas

const router = Router();

router.post( '/', validarArchivoSubir, cargarArchivo)

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
   ], actualizarImagenCloudinary )
//], actualizarImagen )

router.get('/:coleccion/:id', [
    check('id', 'El id debe de ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagen)

// EXPORTACIONES 
module.exports = router;
