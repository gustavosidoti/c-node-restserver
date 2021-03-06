const {Schema, model } = require('mongoose');

const UsuarioSchema = Schema({   // nuestro esquema de usuario
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    correo: {
            type: String,
            required: [true, 'El correo es obligatorio'],
            unique: true
    },

    password: {
            type: String,
            required: [true, 'La constraseña es obligatoria']
    },
    img: {
        type: String
    },
    
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});
// Método para ocultar la version y la cotraeña
UsuarioSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario } = this.toObject(); // lo que no quiero mostrar del objeto
    usuario.uid = _id; // reemplazo el nombre
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema ); 