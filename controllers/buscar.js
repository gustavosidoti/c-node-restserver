// CONTROLADOR DE BÚSQUEDAS
// Importaciones de terceros
const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

// importaciones propias
const { Categoria, Producto, Usuario } = require('../models');

const coleccionesPermitidas = [ 

    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); //funcion de mongoose que revisa si es un id de mongo

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino); // que traiga del modelo de usuario ese que tiene id igual
        return res.json({
            results: ( usuario ) ? [ usuario ] : []  // ternario que muestra usuario si viene y sino muestra vacio
        })
    }

    // Búsqueda insensible
    const regex = new RegExp( termino, 'i'); // expresion regular de javascript toma todo lo que viene

    const usuarios = await Usuario.find({  // podría ser un count - Esos condicionales de búsqueda de mongo
        $or: [{ nombre: regex }, {correo: regex }], // busca por nombre o correo que coincida
        $and: [{ estado: true }] // obligatorio estado en true
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); //funcion de mongoose que revisa si es un id de mongo

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino); // que traiga del modelo de usuario ese que tiene id igual
        return res.json({
            results: ( categoria ) ? [ categoria ] : []  // ternario que muestra usuario si viene y sino muestra vacio
        })
    }

    // Búsqueda insensible
    const regex = new RegExp( termino, 'i'); // expresion regular de javascript toma todo lo que viene

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); //funcion de mongoose que revisa si es un id de mongo

    if ( esMongoID ) {
        const producto = await Producto.findById(termino); // que traiga del modelo de usuario ese que tiene id igual
        return res.json({
            results: ( producto ) ? [ producto ] : []  // ternario que muestra usuario si viene y sino muestra vacio
        })
    }

    // Búsqueda insensible
    const regex = new RegExp( termino, 'i'); // expresion regular de javascript toma todo lo que viene

    const productos = await Producto.find({ nombre: regex, estado: true })
                                    .populate('categoria', 'nombre')

    res.json({
        results: productos
    });

}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params; // desestructuramos la coleccion y el termino de búsqueda

    if(!coleccionesPermitidas.includes( coleccion ) ) { // tiene que venir una coleccion permitida
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
                buscarUsuarios(termino, res);
            break;
            case 'categorias':
                buscarCategorias(termino, res);
            break;
            case 'productos':
                buscarProductos(termino, res);
            break;
            
            case 'roles':
            
            break;
    
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
    }
    
   
}

module.exports = {
    buscar
}