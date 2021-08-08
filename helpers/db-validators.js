
const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');


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

/**
 * USUARIOS 
 */

// verificar si el id del usuario es correcto para actualizar
const existeUsuarioPorId = async( id ) => {

    //verificamos si el id existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id ${ id } no existe`);
    }

}

/**
 * CATEGORIAS 
 */

// verificar si el id de la categoria es correcto para actualizar
const existeCategoriaPorId = async( id ) => {
    
    //verificamos si el id existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id ${ id } no existe`);
    }

}

/**
 * PRODUCTOS 
 */

// verificar si el id de la categoria es correcto para actualizar
const existeProductoPorId = async( id ) => {
    
    //verificamos si el id existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id ${ id } no existe`);
    }

}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}