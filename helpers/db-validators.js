const Role = require('../models/role');
const Usuario = require('../models/usuario');

// Función que corrobora los roles válidos.
 const esRoleValido = async(rol ='') =>{ 
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
            throw new Error(`El rol ${ rol } no está registrado en la BD`)
    }
}

// Verificar si el correo existe
const emailExiste = async( correo = '' ) =>{
    const existeEmail = await Usuario.findOne( { correo });
    if( existeEmail ) {
       throw new Error(`El correo: ${ correo }, ya está registrado`);
    }

}

// verificar si el id del usuario es correcto para actualizar
const existeUsuarioPorId = async( id ) => {

    //verificamos si el id existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id ${ id } no existe`);
    }

}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}