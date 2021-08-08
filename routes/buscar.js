// IMPORTACIONES
const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

// CODIGO
const router = Router();

// RUTAS

router.get('/:coleccion/:termino', buscar)



module.exports = router;