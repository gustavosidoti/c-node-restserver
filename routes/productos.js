// ARCHIVO PARA DEFINIR RUTAS DE USUARIOS

// Importaciones de terceros

const { Router } = require('express');
const { check } = require('express-validator');

// importaciones internas

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearProducto, 
        obtenerProductos, 
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');



/** código de este archivo
 *  {{url}}/api/productos
 *  */ 

// Rutas

const router = Router();

// Obtener todas los productos - público
router.get('/', obtenerProductos );

// Obtener un producto por id - público
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto );

// Crear un producto - privado - cualquier persona con token
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar producto - privado - cualquier persona con token
router.put('/:id', [
    validarJWT,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar producto - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], borrarProducto);



// EXPORTACIONES 
module.exports = router;