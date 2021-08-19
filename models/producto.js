// MODELO DE PRODUCTO

const {Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true,
    },
    // usuario que la crea
    usuario:{
        type: Schema.Types.ObjectId, // hace referencia al schema de usuarios
        ref: 'Usuario', // debe ser el mismo del exports de ese modelo
        required: true
    },

    precio: {
        type: Number,
        default: 0
    },

    categoria: {
        type: Schema.Types.ObjectId, // hace referencia al schema de usuarios
        ref: 'Categoria', // debe ser el mismo del exports de ese modelo
        required: true
    },

    descripcion: { type: String },
    disponible: {type: Boolean, default: true },
    img: { type: String },
});

// Método para ocultar la version y el estado
ProductoSchema.methods.toJSON = function(){
    const { __v, estado, ...data } = this.toObject(); // lo que no quiero mostrar del objeto
    return data;
}

module.exports = model('Producto', ProductoSchema); // Producto es el que se exporta