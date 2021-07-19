const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    code: { type: String, required: true},
    name: { type: String, required: true },
    brand: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true},
    qty: { type: String, required: true },
    category: { type: String, required: true},
    price: { type: String, required: true}
},{
    timestamps: true
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;