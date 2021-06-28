const { request, response } = require('express'); // lo desestructuramos para utilizar los res.

const usuariosGet = (req = request, res = response) => { // el get de usuarios - traer

    const { q, nombre = 'No name', apikey } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey
    });

}

const usuariosPost = (req = request, res = response) => { // el post de usuarios - Agregar

    const { nombre, edad } = req.body; // queremos atrapar esos datos
    
    res.json({ // acá servimos la información
        msg: 'post API - controlador',
        nombre,
        edad
    });

}

const usuariosPut = (req = request, res = response) => { // el put de usuarios

    const { id } = req.params; // extraemos el id de lo que envíe el usuario en la ruta.

    res.json({
        msg: 'put API - controlador',
        id
    });

}

const usuariosPatch = (req, res = response) => { // el get de usuarios

    res.json({
        msg: 'patch API - controlador'
    });

}

const usuariosDelete = (req, res = response) => { // el get de usuarios

        res.json({
            msg: 'delete API - controlador'
        });

}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

}