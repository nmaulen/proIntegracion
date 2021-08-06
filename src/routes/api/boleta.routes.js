const Boleta = require('../../models/boletaModel');
const Joi = require('joi')

module.exports = [
    {
        method: 'POST',
        path: '/api/boleta',
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
                                codeSale: request.payload.codeSale
                            }
                        ]
                    }

                    let boletaExist = await Boleta.find(query)

                    if (boletaExist[0]) {
                        if (request.payload.mod == 'yes') {

                            delete request.payload.mod
                            let boleta = await Boleta(request.payload);
                            boleta._id = productExist[0]._id
                            let boletaSaved = await Boleta.findByIdAndUpdate(boletaExist[0]._id, product)

                            return boleta

                        } else {
                            console.log("error1");
                            return {
                                error: 'La boleta ya existe.'
                            }
                        }
                    }

                    delete request.payload.mod
                    let boleta = await Boleta(request.payload);

                    let boletaSaved = await boleta.save();

                    return boletaSaved

                } catch (error) {
                    console.log(error);
                    return {
                        error: 'Ha ocurrido un error al crear la boleta, por favor recargue la página e intentelo nuevamente.'
                    }
                }

            },
            validate: {
                payload: Joi.object().keys({

                    codeSale: Joi.number().optional(),
                    nombreVendedor: Joi.string().required(),
                    fechaEmision: Joi.string().required(),
                    total: Joi.number().integer().required(),
                    detalle: Joi.array().items(Joi.object().keys({
                        _id: Joi.string().required(),
                        linea: Joi.number().integer().required(),
                        codProducto: Joi.string().required(),
                        nombreProducto: Joi.string().required(),
                        brand: Joi.string().required(),
                        size: Joi.number().integer().required(),
                        color: Joi.string().required(),
                        qty: Joi.number().integer().required(),
                        total: Joi.number().integer().required(),
                        precio: Joi.number().integer().required()
                    }))
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/boletas/{_id}',
        options: {
            auth: { mode: 'try' },
            description: 'check api',
            notes: 'if api doesn t exist return error',
            tags: ['api'],
            handler: async (request, h) => {
                try {
                    let params = request.params;
                    let deleteBoleta = await Boleta.deleteOne( { _id: params._id } )
                    if (deleteBoleta.ok) {
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
        path: '/api/boletas',
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

                    let result = await Boleta.find(query).lean();

                    return result.map(el => {
                        delete el.password;
                        return el;
                    });
                } catch (error) {
                    console.log(error);

                    return h.response({
                        error: 'Ha ocurrido un error al buscar boletas, por favor recargue la página e intentelo nuevamente.'
                    }).code(500);
                }
            }
        }
    }
]