// Importamos modelo y express para las opciones de response
const { response } = require('express');
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.body;
    const query = { estado: true }; // Almacenamos la instrucción de sólo activos en una constante

    const [total, categorias] = await Promise.all([ //arreglo de promesas en simultaneo y desestructuración del resultado
        Categoria.countDocuments(query), // contamos registros activos
        Categoria.find(query)  // acá estan las especificaciones de paginación y activos
            .populate('usuario', 'nombre') // el populate seria como el join. me trae los datos del usuario que grabó
            .skip( Number( desde ) )
            .limit( Number( limite ))
        ]);

        res.json({
            total,
            categorias
        });

}

// Ontener categoría por ID
const obtenerCategoria = async(req, res = response ) => {

    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

      res.json( categoria );
}


const crearCategoria = async(req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }
    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizar categoría
const actualizarCategoria = async(req, res = response) => { // el put de categorias

    const { id } = req.params; // extraemos el id de lo que envíe el usuario en la ruta.
    const { estado, usuario, ...data } = req.body; // separamos esos campos del body

    // TODO validar contra base de datos
    data.nombre  = data.nombre.toUpperCase(); // a mayusculas
    data.usuario = req.usuario._id; // asignamos el usuario que guardó

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true }); // metodo que busca por id y actualiza
                                                                                  // lo que trae la data

    res.json(categoria);

}

const borrarCategoria = async(req, res = response ) => {

    const { id } = req.params;
    // no eliminamos, actualizamos su estado
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false}, {new: true });

    res.json(categoriaBorrada);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}
