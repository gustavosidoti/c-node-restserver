const {Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
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
    }
});

// Método para ocultar la version y el estado
CategoriaSchema.methods.toJSON = function(){
    const { __v, estado, ...data } = this.toObject(); // lo que no quiero mostrar del objeto
    return data;
}

module.exports = model('Categoria', CategoriaSchema);