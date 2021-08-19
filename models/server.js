const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        
        this.app = express();
        this.port = process.env.PORT;
       
        // Los paths de conexiones
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads',
            usuarios:   '/api/usuarios' // el api lo agregamos nosotros, podría ser otra cosa
           
        }
        

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

        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {

        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });

    }

}

module.exports = Server;




