// ARCHIVO INDEX DE LOS MIDDLEWARES

const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarArchivoSubir = require('../middlewares/validar-archivo');

module.exports = { // los 3 puntos significan trae todo
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivoSubir,
}