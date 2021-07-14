const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios'; // el api lo agregamos nosotros, podría ser otra cosa

        // conexión a la base de datos

        this.conectarDB();

        // Middlewares - funciones predefinidas
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();


    }

    async conectarDB(){
        // acá podemos alternar el llamado a una base de datos
        // en producción o en desarrollo
        await dbConnection();
    }

    middlewares(){
        
        // CORS seguridad
        this.app.use( cors() );

        // Parseo y lectura del body
        this.app.use( express.json() ); // lo que venga lo va a meter en json
        
        // Directorio público
        this.app.use( express.static('public') );
    }

    routes() {

        this.app.use( this.usuariosPath, require('../routes/usuarios'));

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });

    }

}

module.exports = Server;




