const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const boletaSchema = new Schema({
    code: { type: String, required: true},
    nombreVendedor: { type: String, required: true },
    fechaEmision: { type: String, required: true },
    neto: { type: Number, required: true },
    total: { type: Number, required: true },
    detalle: [
        {
            _id: false,
            linea: { type: Number, required: true },
            codProducto: { type: String, required: true },
            nombreProducto: { type: String, required: true },
            brand: { type: String, required: true },
            size: { type: String, required: true },
            color: { type: String, required: true},
            qty: { type: String, required: true },
            precio: { type: Number, required: true }
        }
    ]
},{
    timestamps: true
});

const Boleta = mongoose.model('Boletas', boletaSchema);

module.exports = Boleta;