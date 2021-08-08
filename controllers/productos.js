// Controlador de Productos
// Importamos modelo y express para las opciones de response
const { response } = require('express');
const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.body;
    const query = { estado: true }; // Almacenamos la instrucción de sólo activos en una constante

    const [total, productos] = await Promise.all([ //arreglo de promesas en simultaneo y desestructuración del resultado
        Producto.countDocuments(query), // contamos registros activos
        Producto.find(query)  // acá estan las especificaciones de paginación y activos
            .populate('usuario', 'nombre') // el populate seria como el join. me trae los datos del usuario que grabó
            .populate('categoria', 'nombre') // el populate seria como el join. me trae los datos del usuario que grabó
            .skip( Number( desde ) )
            .limit( Number( limite ))
        ]);

        res.json({
            total,
            productos
        });

}

// Ontener producto por ID
const obtenerProducto = async(req, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

      res.json( producto );
}


const crearProducto = async(req, res = response ) => {

    const {estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }
    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);

}

// actualizar producto
const actualizarProducto = async(req, res = response) => { // el put de producto

    const { id } = req.params; // extraemos el id de lo que envíe el usuario en la ruta.
    const { estado, usuario, ...data } = req.body; // separamos esos campos del body

    // TODO validar contra base de datos
    if(data.nombre){
        data.nombre  = data.nombre.toUpperCase(); // a mayusculas
    }
    
    data.usuario = req.usuario._id; // asignamos el usuario que guardó

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true }); // metodo que busca por id y actualiza
                                                                                  // lo que trae la data
    // devuelvo la data para mostrar
    res.json(producto);

}

const borrarProducto = async(req, res = response ) => {

    const { id } = req.params;
    // no eliminamos, actualizamos su estado
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false}, {new: true });

    res.json(productoBorrado);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}
