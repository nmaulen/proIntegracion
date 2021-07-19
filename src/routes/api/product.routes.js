const Product = require('../../models/productModel');
const Joi = require('joi')

module.exports = [
    {
        method: 'POST',
        path: '/api/product',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let query = {
                        $or: [
                            {
                                sku: request.payload.rut
                            }
                        ]
                    }

                    let productExist = await Product.find(query)

                    // if (request.payload.scope == 'Super Administrador'){
                    //     request.payload.scope = "sadmin"
                    // } else if (request.payload.scope == 'Administrador'){
                    //     request.payload.scope = "admin"
                    // }

                    if (productExist[0]) {
                        if (request.payload.mod == 'yes') {

                            if (request.payload.password == '') {
                                request.payload.password = productExist[0].password
                            }

                            if (!validatePassword(productExist[0].password, request.payload.password)) {
                                request.payload.password = hashPassword(request.payload.password)
                            }

                            delete request.payload.mod
                            let product = await Product(request.payload);
                            product._id = productExist[0]._id
                            let productSaved = await product.findByIdAndUpdate(productExist[0]._id, product)

                            productSaved.password = '';

                            return productSaved

                        } else {
                            console.log("error1");
                            return {
                                error: 'El producto ya existe.'
                            }
                        }
                    }

                    // let productPassword = generatePassword()

                    //     let newproduct = new product({
                    //         cod: payload.cod,
                    //         status: payload.status,
                    //         scope: payload.scope,
                    //         password: hashPassword(productPassword)
                    //     })
                    request.payload.password = hashPassword(request.payload.password)

                    delete request.payload.mod
                    let product = await Product(request.payload);

                    let productSaved = await product.save();

                    productSaved.password = '';

                    return productSaved

                } catch (error) {
                    console.log(error);
                    return {
                        error: 'Ha ocurrido un error al crear el producto, por favor recargue la página e intentelo nuevamente.'
                    }
                }

            },
            validate: {
                payload: Joi.object().keys({
                    code: Joi.string().required(),
                    name: Joi.string().required(),
                    brand: Joi.string().required(),
                    size: Joi.string().allow(null, ''),
                    color: Joi.string().required(),
                    qty: Joi.string().allow(null, ''),
                    category: Joi.string().required(),
                    price: Joi.string().required(),
                    mod: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/products/{_id}',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let params = request.params;
                    let deleteProduct = await Product.deleteOne( { _id: params._id } )
                    if (deleteProduct.ok) {
                        return {
                            ok: true
                        };
                    }

                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }

            }
        }
    },
    {
        method: 'GET',
        path: '/api/products',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let query = {
                        $or: [
                            {
                                scope: { $not: { $eq: 'dev'} }
                            }
                        ]
                    }

                    let result = await Product.find(query).lean();

                    return result.map(el => {
                        delete el.password;
                        return el;
                    });
                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar productos, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    }
]