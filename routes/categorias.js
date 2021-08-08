// ARCHIVO PARA DEFINIR RUTAS DE CATEGORIAS

// Importaciones de terceros

const { Router } = require('express');
const { check } = require('express-validator');

// importaciones internas

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');



/** código de este archivo
 *  {{url}}/api/categorias
 *  */ 

// Rutas

const router = Router();

// Obtener todas las categorias - público
router.get('/', obtenerCategorias );

// Obtener una categoria por id - público
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerCategoria );

// Crear categoria - privado - cualquier persona con token
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar categoria - privado - cualquier persona con token
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// Borrar categoria - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], borrarCategoria);



// EXPORTACIONES 
module.exports = router;
