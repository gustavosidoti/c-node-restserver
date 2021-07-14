// ARCHIVO PARA DEFINIR RUTAS DE USUARIOS

// Importaciones

const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost, 
        usuariosPut,
        usuariosPatch,
        usuariosDelete } = require('../controllers/usuarios');


// Rutas 

const router = Router();

router.get('/', usuariosGet );

router.post('/', [ // arreglo de middlewares para enviar varios si queremos
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // no esté vacío 
        check('password', 'El password debe ser de más de 6 caracteres').isLength({ min: 6 }),
        check('correo').custom( emailExiste ), // chequea si es un correo lo que enviaron
        //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom( esRoleValido ),
        validarCampos // llamamos el middleware que hará la última revisión
] , usuariosPost );

router.put('/:id',[
        check('id', 'No es in ID válido').isMongoId(), // primer validador de id
        check('id').custom( existeUsuarioPorId ), // segunda verificacion y llamada a la función
        check('rol').custom( esRoleValido ), // pedimos el rol para que no cualquiera actualice.
        validarCampos, // funcion que sirve para que no continue si hay errores de validación
], usuariosPut ); // requerimos un id

router.patch('/', usuariosPatch );

router.delete('/:id',[
        check('id', 'No es in ID válido').isMongoId(), // primer validador de id
        check('id').custom( existeUsuarioPorId ), // segunda verificacion y llamada a la función
        validarCampos,
], usuariosDelete );

// Compartimos el módulo
module.exports = router;