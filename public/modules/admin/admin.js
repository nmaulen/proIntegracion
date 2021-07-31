// import readXlsxFile from 'read-excel-file'

// const input = document.getElementById('input')

// input.addEventListener('change', () => {
//   readXlsxFile(input.files[0]).then((rows) => {
//     // `rows` is an array of rows
//     // each row being an array of cells.
//   })
// })

const internals = {
    tables: {
        products: {
            datatable: null,
            rowSelected: null
        }
    },
    selectedSaleProducts: [],
    newSale: {
        fechaEmision: moment().format('YYYY-MM-DD'),
        productsRowsData: [],
    }
}
let categoriesList

ready(async () => {
    initProductsTable()
    // categoriesList = await axios.get('api/subCategories')
})

document.querySelector('#nuevaCargaBtn').addEventListener('click', () => {
    handleModal()
})

async function initProductsTable() {
    loadingHandler('start')
    await $.when(internals.tables.products.datatable = $('#productsTable').DataTable({
        language: {
            url: spanishDataTableLang
        },

        // rowCallback: function( row, data ) {
        //     $(row).find('td:eq(1)').html(capitalizeAll(data.name))
        // },
        order: [[1, 'desc']],
        columnDefs: [
            { "width": "100px", "targets": 0 },
            { "width": "1150px", "targets": 1 }
        ],
        ordering: true,
        searchHighlight: true,
        responsive: false,
        columns: [
            { data: 'code' },
            { data: 'name' },
            { data: 'brand'},
            { data: 'size' },
            { data: 'color' },
            { data: 'qty' },
            { data: 'category'},
            { data: 'price'}
        ],

        // rowCallback: function (row, data, index) {
        //     //if(data.estadoPago == true) {
        //     if (data.star == 'yes') {
        //         $(row).find('td:eq(4)').html('<center> <button type="button" class="btn btn-secondary btn-sm featureProduct"><i class="fas fa-star"></i></button> </center> ')
        //     } else {
        //         $(row).find('td:eq(4)').html('<center> <button type="button" class="btn btn-secondary btn-sm featureProduct"><i class="far fa-star"></i></button> </center> ')

        //     }
        //     // $(row).find('td:eq(5)').html('<center> <button type="button" class="btn btn-secondary btn-sm modProduct"><i class="fas fa-edit"></i></button> </center> ')
        //     // $(row).find('td:eq(6)').html('<center> <button type="button" class="btn btn-secondary btn-sm delProduct"><i class="fas fa-trash"></i></button> </center> ')
        //     // } else  {
        //     // 	$(row).find('td:eq(0)').html('<center> <i style="color: red" class="fas fa-times-circle"></i> </center> ')
        //     // }
        // },

    }))

    loadDataToProductsTable()

    // $('#productsTable tbody').on('click', '.featureProduct', async function () {
    //     var data = internals.tables.products.datatable.row($(this).parents('tr')).data();

    //     if (this.innerHTML.includes("fas")) {
    //         data.star = 'no'
    //         await axios.post('/api/productsStar', data)
    //         this.innerHTML = "<i class=\"far fa-star\"></i>"
    //     } else {
    //         data.star = 'yes'
    //         await axios.post('/api/productsStar', data)
    //         this.innerHTML = "<i class=\"fas fa-star\"></i>"
    //     }
    // });

    $('#productsTable tbody').on('click', '.delProduct', async function () {
        var data = internals.tables.products.datatable.row($(this).parents('tr')).data();

        dataProd = {
            sku: data.sku
        }

        await axios.post('/api/deleteProduct', dataProd)

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-danger',
              cancelButton: 'btn btn-success'
            },
            buttonsStyling: false
          })

          swalWithBootstrapButtons.fire({
            title: '¿Estas seguro?',
            text: "No se podra revertir la eliminación de un producto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {

                internals.tables.products.datatable
                .row($(this).parents('tr'))
                .remove()
                .draw()
                toastr.success('Producto Eliminado correctamente')
                
                swalWithBootstrapButtons.fire(
                'Eliminado',
                '',
                'success'
              )
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                '',
                'error'
              )
            }
          })
        
        
    });

    $('#productsTable tbody').on('click', '.modProduct', function () {
        var data = internals.tables.products.datatable.row($(this).parents('tr')).data();
        // alert("Modificar: " + data.sku);
        initMod(data)
    });

    $('#filterStar').on('change', function () {
        if (this.checked) {
            loadDataToProductsTable(this.checked)
        } else {
            loadDataToProductsTable()
        }
    })

    // async function initMod(product) {

    //     const modalMod = {
    //         title: document.querySelector('#modal_title'),
    //         body: document.querySelector('#modal_body'),
    //         footer: document.querySelector('#modal_footer'),
    //     }


    //     modalMod.title.innerHTML = `
    //         Modificar producto SKU: ${product.sku}
    //     `
    //     modalMod.body.innerHTML = `
    //     <div class="row">
    //         <div class="col-md-6" style="margin-top:10px;">
    //         Título *
    //             <input id="modTitulo" type="text" value="${product.title}" class="form-control border-input">
    //         </div>

    //         <div class="col-md-6" style="margin-top:10px;">
    //         Descripción *
    //             <input id="modDesc" type="text" value="${product.description}" class="form-control border-input">
    //         </div>

    //         <div class="col-md-6" style="margin-top:10px;">
    //         Categoría *
    //             <select id="selectCategory" class="custom-select">
    //                 <option value="0">Seleccione una categoria </option>
    //             </select>
    //         </div>
    //         <div class="col-md-6" style="margin-top:10px;">
    //         Subcategoría *
    //             <select id="selectSubcategory" class="custom-select">
    //                 <option value="0">Seleccione una categoria </option>
    //             </select>
    //         </div>

    //         <div class="col-md-6" style="margin-top:10px;">
    //         Imagen(es)
    //             <input id="modImg" type="text" class="form-control border-input">
    //         </div>

    //         <div class="col-md-6" style="margin-top:10px;">
    //         Video(s)
    //             <input id="modVid" type="text" class="form-control border-input">
    //         </div>

    //         <div class="col-md-6" style="margin-top:10px;">
    //         PDF(s)
    //             <input id="modPdf" type="text" class="form-control border-input">
    //         </div>
    //         <div class="col-md-12" style="margin-top:10px;"><br><br></div>
            
    //         <div class="alert alert-dismissible alert-warning">
    //             <h4 class="alert-heading">Para guardar un video/imagen/pdf es necesario lo siguiente:</h4>
    //             <p class="mb-0">
    //             <br>Los accesos a las imagenes deben ser links directos
    //             <br>Solo se admitiran videos subidos a Youtube <i class="fab fa-youtube"></i>
    //             <br>Los accesos a pdf deben ser links directos
    //             <br>En caso de tener mas de un link deberan separarse mediante comas (, )
    //             </p>
    //         </div>

    //         <br>
    //         <div class="col-md-12" id="modProdErrorMessage"></div>

    //     </div>
    //         `
    //     modalMod.footer.innerHTML = `
    //     <button class="btn btn-dark" data-dismiss="modal">
    //     <i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
    //     </button>
    
    //     <button class="btn btn-dark" id="saveProduct">
    //     <i style="color:#3498db;" class="fas fa-check"></i> Guardar
    //     </button>
    //     `

    //     //CATEGORIA
    //     let parentArray = []

    //     categoriesList.data.forEach((el, i) => {
    //         let a = {
    //             id: el.parent,
    //             text: el.parent
    //         }
    //         parentArray.push(a)
    //     })

    //     $('#selectCategory').empty();
    //     $('#selectCategory').select2({
    //         width: '100%',
    //         minimumResultsForSearch: -1,
    //         data: parentArray
    //     })

    //     // $('#selectCategory').on('select2:select', function (e) {
    //     //     // console.log("tipo seleccionado", e.params.data.id);
    //     // });


    //     //SUBCATEGORIA
    //     $('#selectSubcategory').empty();
    //     $('#selectSubcategory').select2({
    //         width: '100%',
    //         minimumResultsForSearch: -1,
    //         data: [{ id: '-1', text: '- Seleccione una categoria primero -' }]
    //     })

    //     $('#selectCategory').on('change', function (el) {
    //         if (el.target.value !== "-1") {

    //             let subArray = []
    //             categoriesList.data.forEach((cat, i) => {
    //                 cat.sub.forEach(sub => {
    //                     if (cat.parent == el.target.value) {
    //                         let a = {
    //                             id: sub,
    //                             text: sub
    //                         }
    //                         subArray.push(a)
    //                     }
    //                 });
                    
    //             })

    //             subArray.unshift({ id: '-1', text: '- Seleccione una subCategoria -' })


    //             $('#selectSubcategory').empty();
    //             $('#selectSubcategory').select2({
    //                 width: '100%',
    //                 minimumResultsForSearch: -1,
    //                 data: subArray
    //             })

    //             // $('#selectSubcategory').on('select2:select', function (e) {
    //             //     // console.log("tipo seleccionado", el.target.value);
    //             //     // console.log("envase seleccionado", e.params.data.id);
                    
    //             // });


    //         } else {
    //             $('#selectSubcategory').empty();
    //             $('#selectSubcategory').select2({
    //                 width: '100%',
    //                 minimumResultsForSearch: -1,
    //                 data: [{ id: '-1', text: '- Seleccione una categoria primero -' }]
    //             })

    //         }

    //     })


    //     if (product) {
    //         if (product.category) {
    //             $('#selectCategory').val(product.category).trigger('change');
    //         }
    //         if (product.subCategory) {
    //             $('#selectSubcategory').val(product.subCategory).trigger('change');
    //         }

    //         product.info.forEach(el => {
    //             if (el.name == 'Imagen') {
    //                 if (el.data !== '') {
    //                     $('#modImg').val(el.data)
    //                 }
    //             }
    //             if (el.name == 'video') {
    //                 if (el.data !== '') {
    //                     $('#modVid').val(el.data)
    //                 }
    //             }
    //             if (el.name == 'pdf') {
    //                 if (el.data !== '') {
    //                     $('#modPdf').val(el.data)
    //                 }
    //             }
    //         });
    //     }


    //     $('#modal').modal('show')

    //     $('#saveProduct').on('click', async function(){
    //         saveProduct(product)
    //     })

    // }
    // $('#productsTable tbody').on('click', 'tr', function () {
    // 	internals.tables.products.rowSelected = internals.tables.products.datatable.row($(this).closest('tr'))

    // 	if (internals.tables.products.rowSelected.data()) {
    // 		let selectedProductData = internals.tables.products.rowSelected.data()

    // 		handleProduct(selectedProductData)
    // 	}
    // })
    loadingHandler('stop')
}

async function loadDataToProductsTable(filter) {
    loadingHandler('start')
    try {
        let result
        // if (filter || $('#filterStar')[0].checked) {
        //     result = await axios.get('api/productsStar')
        // } else {
        //     result = await axios.get('api/products')
        // }

        let productsData = result.data


        if (Array.isArray(productsData)) {
            productsData.map(el => {
                if (!el.modificar) el.modificar = '-'
                if (!el.eliminar) el.eliminar = '-'
            })
        } else {
            productsData.modificar = '-'
            productsData.eliminar = '-'
            productsData = [productsData]
        }
        

        internals.tables.products.datatable.clear().draw()
        internals.tables.products.datatable.rows.add(productsData).draw()

    } catch (error) {
        console.log(error)
        console.log("error? wat");
        internals.tables.products.datatable.clear().draw()
    }
    loadingHandler('stop')
}

const handleModal = (originalData) => {
    const modalSelector = {
        title: document.querySelector('#modal_title'),
        body: document.querySelector('#modal_body'),
        footer: document.querySelector('#modal_footer'),
    }

    internals.newSale.number = undefined
    internals.newSale.productsRowsData = []

    let today = moment().format('YYYY-MM-DD')
    internals.newSale.fechaEmision = moment(today).format('YYYY-MM-DD')

    internals.newSale.total = 0
    internals.newSale.notasDeVenta = []

    if (originalData) {
        // await getAuxiliarCompleto(originalQuoteData.codAuxiliar)

        internals.newSale.title = `<i class="fas fa-file-invoice"></i> Boleta <span class="badge badge-primary">N° ${originalData.code}</span>`
        internals.newSale.code = originalData.code
        internals.newSale.rut = originalData.rut
        internals.newSale.name = originalData.name

        internals.newSale.fechaEmision = moment(originalData.fechaEmision).format('YYYY-MM-DD') // fecha creacion o fecha emision?

        internals.newSale.productsRowsData = originalData.detalle.reduce((acc,el,i) => {
            acc.push({
                price: el.precioUnitario,
                qty: el.cantidad,
                rowSubTotal: el.total,
                product: {
                    code: el.codProducto,
                    name: el.nombreProducto,
                    brand: el.brand,
                    size: el.size
                }
            })

            return acc
        }, [])

        // let resBuscarNotasDeVenta = await axios.get(`/api/NvsByCotCod/${internals.newSale.number}`)

        // internals.newSale.notasDeVenta = resBuscarNotasDeVenta.data
    }
    
    internals.selectedSaleProducts = internals.newSale.productsRowsData

    modalSelector.title.innerHTML = internals.newSale.title

    modalSelector.body.innerHTML = `
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 form-group">
                <div class="row">

                    <div class="col-md-12 form-group">
                        <fieldset">
                            <label class="control-label" for="seller">Vendedor</label>
                            <input class="form-control" id="seller" type="text" value="${internals.newSale.name} " disabled="">
                        </fieldset>
                    </div>

                </div>
            </div>
                <div class="col-md-6 form-group">
                <div class="row">
                <div class="col-md-12 form-group">
                        <fieldset disabled="">
                            <label class="control-label" for="fechaEmision">Fecha creación</label>
                            <input class="form-control" id="fechaEmision" type="text" value="${moment(internals.newSale.fechaEmision).format('DD/MM/YYYY')}" disabled="">
                        </fieldset>
                    </div>
                </div>
                </div>
            <br>

            <div style="width:100%;">
                <h3 class="text-center">Productos</h3>

                <button id="newProductRow" style="display: block; margin-bottom: 10px; margin-left: 20px;" type="button" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Añadir producto</button>
            </div>

            <div class="col-md-12 col-xs-12 table-responsive">

                <table id="tableSaleProducts" class="display table table-condensed" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th></th>
                            <th>Código</th>
                            <th>Nombre Producto</th>
                            <th>Talla</th>
                            <th>Color</th>
                            <th>Precio unitario</th>
                            <th>Cantidad</th>
                            <th>Sub total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="tableSaleProductsBody"></tbody>
                </table>
            </div>

            <div class="col-md-6"></div>
            <div class="col-md-6">
                <table width="100%">
                    <tbody>
                        <tr>
                            <td><b><h3>Total</h3></b></td>
                            <td id="saleTotal">$ 0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
    `
    modalSelector.footer.innerHTML = `
    <button class="btn btn-dark" data-dismiss="modal">
    <i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
    </button>

    <button  class="btn btn-dark" id="saveExcel">
    <i style="color:#3498db;" class="fas fa-check"></i> Guardar
    </button>
	`

    $('#modal').modal('show')
    // let arrayBuffer
    // const fileSelector = document.getElementById('excelFile');
    // fileSelector.addEventListener('change', (event) => {

    //     const file = event.target.files[0];
    //     var reader = new FileReader();
    //     reader.readAsArrayBuffer(file);
    //     reader.onloadend = async function (event) {
    //         arrayBuffer = reader.result;
    //     };

    // });

    // $('#saveExcel').on('click', async function () {
    //     if (!arrayBuffer || arrayBuffer == '') {
    //         toastr.warning('Debe seleccionar un excel')
    //     } else {

    //         await selectSave(arrayBuffer)
    //     }
    // });
    if (!originalData) {
        addRowToTable()
    }
    querySelector('#newProductRow').addEventListener('click', () => {
        addRowToTable()
        drawTableBody()
    })

}

function addRowToTable() {
    if (internals.newSale.productsRowsData.length < 24) {
        internals.newSale.productsRowsData.push({
            product: {
                code: '',
                name: ''
            },
            qty: 0,
            price: 0,
            minPrice: 0,
            rowSubTotal: 0
        })
    } else {
        toastr.warning('El maximo de filas por cotizacion es de 24.')
    }

}

function deleteRow(rowId) {
    internals.newSale.productsRowsData.splice(rowId, 1)
    drawTableBody()
}

function drawTableBody() {
    // console.log(internals.newSale.productsRowsData, 'eee')

    querySelector('#tableSaleProductsBody').innerHTML = internals.newSale.productsRowsData.reduce((acc, el, i) => {
        acc += `
            <tr id="row-${i}">
                <td>
                    <b>${i + 1}</b>
                </td>
                <td>
                    <button onclick="selectProduct(${i})" type="button" class="btn btn-primary btn-sm searchProduct"><i class="fas fa-search"></i></button>
                </td>
                <td id="productCode-${i}">
                    ${(el.product.code === '') ? '-SELECCIONE PRODUCTO-' : el.product.code}
                </td>
                <td id="productName-${i}">
                    ${(el.product.name === '') ? '-SELECCIONE PRODUCTO-' : el.product.name}
                </td>
                <td id="productSize-${i}">
                    ${(el.product.size === '') ? '-SELECCIONE PRODUCTO-' : el.product.size}
                </td>
                <td id="productColor-${i}">
                    ${(el.product.color === '') ? '-SELECCIONE PRODUCTO-' : el.product.color}
                </td>
                <td id="productBrand-${i}">
                    ${(el.product.brand === '') ? '-SELECCIONE PRODUCTO-' : el.product.brand}
                </td>
                <td>
                    <input class="productInputQty rowInput" data-row="${i}" id="productQty-${i}" type="text" value="${el.qty}">
                </td>
                <td id="productBrand-${i}">
                    ${(el.product.price === '') ? '-SELECCIONE PRODUCTO-' : el.product.price}
                </td>
                <td style="width: 150px !important;"><span>$ </span><span id="subTotal-${i}" >${dot_separators(el.rowSubTotal)}</span></td>
                <td>
                    <button onclick="deleteRow(${i})" type="button" class="btn btn-danger btn-sm deleteProduct"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `
        return acc
    }, '')

    document.querySelectorAll('.productInputQty').forEach(el => {
        new Cleave(el, {
            blocks: [6],
            numeral: true,
            numericOnly: true,
            numeralPositiveOnly: true,
            numeralThousandsGroupStyle: 'thousand',
            numeralDecimalMark: ",",
            delimiter: "."
        })
    })

    document.querySelectorAll('.productInputUnitPrice').forEach(el => {
        new Cleave(el, {
            prefix: '$ ',
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
            numeralDecimalScale: 0,
            numeralPositiveOnly: true,
            numeralDecimalMark: ",",
            delimiter: "."
        })
    })

    updateFinalsAmounts()
}

async function updateFinalsAmounts(rt = false) {

    let subtotals = internals.newSale.productsRowsData.reduce((acc, el, i) => {
        // el.rowSubTotal = parseInt(el.rowSubTotal)
        acc += el.rowSubTotal

        return acc
    }, 0)

    // console.log('aaa',{
    //     subtotals,
    //     iva: Math.round(subtotals * 0.19),
    //     total: subtotals + Math.round(subtotals* 0.19)
    // })
    
    // let taxValue = Math.round(subtotals * 0.19)

    let amounts = {
        subtotals,
        // tax: taxValue,
        total: subtotals
    }

    if (rt) {
        return amounts
    }

    internals.newSale.subtotal = amounts.subtotals
    // internals.newSale.tax = amounts.tax
    internals.newSale.total = amounts.total

    // document.getElementById('quoteSubtotal').innerHTML = `$ ${dot_separators(amounts.subtotals)}`
    // document.getElementById('quoteTax').innerHTML = `$ ${dot_separators(amounts.tax)}`
    document.getElementById('quoteTotal').innerHTML = `$ ${dot_separators(amounts.total)}`
}


async function selectSave(arrayBuffer) {
        const  swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: '¿Estas seguro?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Subir',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                'El archivo fue subido correctamente',
                'success'
                )
                saveExcel(arrayBuffer)
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'error'
              )
            }
        })
}

// async function saveExcel(arrayBuffer) {

//     var workbook = new ExcelJS.Workbook();
//     workbook.xlsx.load(arrayBuffer).then(async function (workbook) {
//         // console.log("rows", workbook._worksheets[1]._rows[1]._cells[13]._value.model.value)
//         let arraydata = []
//         // if cells > 12 = atributos

//         let data = workbook._worksheets[1]._rows

//         let final = []
//         let keyobj = []
//         let keyobjRaw = []
//         data.forEach((ed, i) => {
//             if (i == 1) {
//                 ed._cells.forEach((el) => {
//                     keyobj.push(
//                         (removeAccents2(removeSpecials2((el._value.model.value).trim()))).toLowerCase()
//                     )
//                     keyobjRaw.push(
//                         el._value.model.value
//                     )
//                 })
//             }
//         });

//         data.forEach((ed, i) => {
//             if (i !== 0 && i !== 1) {
//                 let rowProd = {}
//                 ed._cells.forEach((cell, o) => {
//                     if (cell._value.model.value !== '') {
//                         if (typeof cell._value.model.value == 'undefined' && cell._value.model.text !== '') {
//                             rowProd[keyobj[o]] = cell._value.model.text
//                         } else {
//                             rowProd[keyobj[o]] = cell._value.model.value
//                         }
//                     }
//                     if (o === ed._cells.length - 1) {
//                         final.push(rowProd)
//                     }
//                 })
//             }
//         })

//         final.forEach((el, i) => {
//             let a = {}
//             //let xEl = workbook._worksheets[1]._rows[1]._cells[i]._value.model.value
//             if (el.infostatus == 'COMPLETADO' && el.sku && el.productid && el.descripcion && el.titulo && 
//             el.categoriapadrecategorianodefinidaensap && 
//             el.categoriacategoriapadresap && el.subcategoriacategoriasap) {
//                 let copyEl = el
//                 a.sku = el.sku
//                 a.productId = el.productid
//                 a.title = el.titulo
//                 a.star = 'no'
//                 a.status = 'enabled'
//                 a.category = el.categoriapadrecategorianodefinidaensap
//                 a.subCategory = el.categoriacategoriapadresap
//                 a.subCategory2 = el.subcategoriacategoriasap
//                 a.description = el.descripcion
//                 a.use = el.uso
//                 a.benefits = el.beneficio
//                 // if ((el.descripcion) ? a.description = el.descripcion : a.description = '')
//                 // if ((el.uso) ? a.use = el.uso : a.use = '')
//                 // if ((el.beneficio) ? a.benefits = el.beneficio : a.benefits = '')

//                 delete copyEl.sku
//                 delete copyEl.productid
//                 delete copyEl.infostatus
//                 delete copyEl.titulo
//                 delete copyEl.caracteristicas
//                 delete copyEl.categoriapadrecategorianodefinidaensap
//                 delete copyEl.categoriacategoriapadresap
//                 delete copyEl.subcategoriacategoriasap
//                 delete copyEl.descripcion
//                 delete copyEl.uso
//                 delete copyEl.beneficio


//                 let infoFin = []
//                 Object.keys(copyEl).forEach(e => {
//                     let dataNam = {}
//                     keyobjRaw.forEach(ell => {
//                         let clare = (removeAccents2(removeSpecials2((ell).trim()))).toLowerCase()
//                         if (e == clare) {
//                             dataNam.name = ell
//                             dataNam.data = copyEl[e]
//                             infoFin.push(dataNam)
//                         }
//                     });

//                 });

//                 // a.info = copyEl
//                 a.info = infoFin
//                 arraydata.push(a)
//             }
//         })
//         // console.log("aaaa", arraydata[0]);
//         try {
//             if (arraydata.length === 0) {
//                 toastr.warning('No se ha encontrado ningun producto valido para ser ingresado')
//             } else {
                
//                 let res = await axios.post('/api/products', arraydata)

//                 if (res.data.ok) {

//                     loadDataToProductsTable()

//                     loadingHandler('stop')
//                     toastr.success('Producto(s) subido(s) correctamente')
//                     $('#modal').modal('hide')
//                 } else {
//                     toastr.warning('Ha ocurrido un error al ingresar productos en la base de datos')
//                 }
//             }
//         } catch (error) {
//             console.log("err", error)
//         }
//     });

// }

async function selectProduct(rowId) {
    console.log(rowId)

    let productSelectedData = await Swal.fire({
        title: 'Seleccionar producto',
        customClass: 'swal-wide',
        html: `
            <form id="searchProductForm">
                <div class="form-group">
                    <input id="searchProductName" class="form-control form-control-lg" type="text" placeholder="Nombre del producto" />
                </div>

                <button type="submit" class="btn btn-primary btn-block" id="searchProductBtn">BUSCAR</button>
            </form>

            <br/>
            <div style="max-height: 400px !important; overflow-y: scroll;">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <td></td>
                            <td>#</td>
                            <td>CODIGO</td>
                            <td>NOMBRE</td>
                            <td>TALLA</td>
                            <td>COLOR</td>
                            <td>MARCA</td>
                        </tr>
                    </thead>
                    <tbody id="productosTable"></tbody>
                </table>
            </div>
        `,
        onBeforeOpen: () => {
            try {
                let productNameSelector = document.querySelector('#searchProductName')

                setTimeout(() => {
                    productNameSelector.focus()
                }, 500)

                document.querySelector('#searchProductForm').addEventListener('submit', async (evt) => {
                    evt.preventDefault()

                    let productName = productNameSelector.value || ''

                    if (productName !== '') {
                        loadingHandler('start')

                        let res = await axios.post(`/api/products`, {
                            name: productName
                        })

                        document.querySelector('#productosTable').innerHTML = res.data.reduce((acc, el, i) => {
                            acc += `
                                <tr onclick="selectProductRadio(${i})">
                                    <td><input id="product-${i}" type="radio" name="product" data-codproducto="${el.codProducto}" data-description="${el.descripcion}"></td>
                                    <td>${i + 1}</td>
                                    <td>${el.code}</td>
                                    <td>${el.name}</td>
                                    <td>${el.size}</td>
                                    <td>${el.color}</td>
                                    <td>${el.brand}</td>
                                </tr>
                            `

                            return acc
                        }, '')

                        loadingHandler('stop')
                    } else {
                        toastr.warning('Ingrese nombre del producto')
                    }
                })
            } catch (error) {
                loadingHandler('stop')

                console.log(error)
            }
        },
        preConfirm: async () => {
            try {
                let productSelected = document.querySelector("input[name=product]:checked")

                if (productSelected) {
                    // obtener y asignar precio minimo
                    

                    // let productMinValueResponse = await axios.post('/api/product/productPrice', {
                    //     code: productSelected.dataset.codproducto
                    // })

                    // console.log({productMinValueResponse})

                    // if (productMinValueResponse.data.costoUnitario) {
                    //     productMinValue = productMinValueResponse.data.costoUnitario
                    // }

                    return {
                        ...productSelected.dataset
                    }
                }

                throw new Error('Debe seleccionar un producto.')
            } catch (error) {
                Swal.showValidationMessage(error)
            }
        },
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        confirmButtonText: 'Seleccionar',
        cancelButtonText: 'Cancelar'
    })

    if (productSelectedData.value) {
        internals.newCot.productsRowsData[rowId].product.code = productSelectedData.value.code
        internals.newCot.productsRowsData[rowId].product.name = productSelectedData.value.name
        internals.newCot.productsRowsData[rowId].product.size = productSelectedData.value.size
        internals.newCot.productsRowsData[rowId].product.color = productSelectedData.value.color
        internals.newCot.productsRowsData[rowId].product.brand = productSelectedData.value.brand
        // internals.newCot.productsRowsData[rowId].product.minValue = Math.round(productSelectedData.value.minValue)

        document.querySelector(`#productCode-${rowId}`).innerHTML = productSelectedData.value.code
        document.querySelector(`#productName-${rowId}`).innerHTML = productSelectedData.value.name
        document.querySelector(`#productSize-${rowId}`).innerHTML = productSelectedData.value.size
        document.querySelector(`#productColor-${rowId}`).innerHTML = productSelectedData.value.color
        document.querySelector(`#productBrand-${rowId}`).innerHTML = productSelectedData.value.brand
        // document.querySelector(`#productMinPrice-${rowId}`).innerHTML = Math.round(productSelectedData.value.minValue)
    }
}

function selectProductRadio(id) {
    document.querySelector(`#product-${id}`).click()
}

// async function saveProduct(product) {

//     let saveMod = {
//         sku: product.sku,
//         title: $('#modTitulo').val(),
//         description: $('#modDesc').val(),
//         category: $('#selectCategory').val(),
//         subCategory: $('#selectSubcategory').val(),
//         image: $('#modImg').val(),
//         video: $('#modVid').val(),
//         pdf: $('#modPdf').val(),
//     }
//     let validateProd = await validateProductData(saveMod)

//     if (validateProd.ok) {
//         let saveProd = await axios.post('/api/modProducts', saveMod)
//         if (!saveProd.data.error) {
//             toastr.success('El producto se ha modificado correctamente')
    
//             internals.tables.products.datatable
//             .row( product )
//             .remove()
//             .draw()
    
//             product.title = saveMod.title
//             product.description = saveMod.description
//             product.category = saveMod.category
//             product.subCategory = saveMod.subCategory

//             product.info.forEach(el => {
//                 if (el.name == 'Imagen') {
//                     el.data = saveMod.image
//                 }
//                 if (el.name == 'video') {
//                     el.data = saveMod.video
//                 }
//                 if (el.name == 'pdf') {
//                     el.data = saveMod.pdf
//                 }
//             });

//             product.info.forEach((el, i) => {
//                 if (el.name !== 'Imagen') {
//                     if (i == product.info.length-1 ) {
//                         product.info.push({
//                             name: 'Imagen',
//                             data: saveMod.image
//                         })
//                     }
//                 }
//                 if (el.name !== 'video') {
//                     if (i == product.info.length-1 ) {
//                         product.info.push({
//                             name: 'video',
//                             data: saveMod.video
//                         })
//                     }
//                 }
//                 if (el.name !== 'pdf') {
//                     if (i == product.info.length-1 ) {
//                         product.info.push({
//                             name: 'pdf',
//                             data: saveMod.pdf
//                         })
//                     }
//                 }
//             });
    
//             let modProdAdded = internals.tables.products.datatable
//             .row.add(product)
//             .draw()
//             .node();
    
//             $(modProdAdded).css( 'color', '#1abc9c' )
//             setTimeout(() => {
//                 $(modProdAdded).css( 'color', '#484848' )
//             }, 5000);
    
//             $('#modal').modal('hide')
    
//         }else {
//             toastr.warning(saveProd.data.error)
//         }
//     } else {
//         toastr.warning('Ha ocurrido un error al verificar los datos del producto')
//     }
    
// }

async function validateProductData(prodData) {
    // console.log(prodData)
    let validationCounter = 0
    let errorMessage = ''

    // let saveMod = {
    //     sku: product.sku,
    //     title: $('#modTitulo').val(),
    //     description: $('#modDesc').val(),
    //     category: $('#selectCategory').val(),
    //     subCategory: $('#selectSubcategory').val()
    // }

    if(prodData.title.length > 1) { // 1
        validationCounter++
        $('#modTitulo').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar el titulo del producto`
        $('#modTitulo').css('border', '1px solid #e74c3c')
    }

    if(prodData.description.length > 1) { // 2
        validationCounter++
        $('#modDesc').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar la descripcion del producto</b>`
        $('#modDesc').css('border', '1px solid #e74c3c')
    }

    if(prodData.category) { // 3
        validationCounter++
        $('#selectCategory').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe seleccionar una categoria`
        $('#selectCategory').css('border', '1px solid #e74c3c')
    }


    if(prodData.subCategory !== "-1") { // 4
        validationCounter++
        $('#selectSubcategory').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe seleccionar una sub categoria`
        $('#selectSubcategory').css('border', '1px solid #e74c3c')
    }

    // if(prodData.image.length > 1) { // 5
    //     validationCounter++
    //     $('#modImg').css('border', '1px solid #3498db')
    // } else {
    //     errorMessage += `<br>Debe ingresar un link`
    //     $('#modImg').css('border', '1px solid #e74c3c')
    // }

    // if(prodData.video.length > 1) { // 6
    //     validationCounter++
    //     $('#selectSubcategory').css('border', '1px solid #3498db')
    // } else {
    //     errorMessage += `<br>Debe ingresar un link`
    //     $('#selectSubcategory').css('border', '1px solid #e74c3c')
    // }

    // if(prodData.pdf.length > 1) { // 7
    //     validationCounter++
    //     $('#selectSubcategory').css('border', '1px solid #3498db')
    // } else {
    //     errorMessage += `<br>Debe ingresar un link`
    //     $('#selectSubcategory').css('border', '1px solid #e74c3c')
    // }


    // console.log('validation', validationCounter)
    if(validationCounter == 4) {
        $('#modProdErrorMessage').empty()
        return {ok: prodData}
    } else {
        $('#modProdErrorMessage').html(`
        <div class="alert alert-dismissible alert-warning">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <h4 class="alert-heading">Debe solucionar los siguientes errores</h4>
            <p class="mb-0">${errorMessage}</p>
        </div>
        `)

        return {err: prodData}
    }
}

function removeSpecials2(data) {
    data = data.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
    data = data.replace(/\s/g, '')
    data = data.replace(/-/g, '')
    return data
}
function removeAccents2(data) {
    data = data.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return data
}
