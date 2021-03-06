let datatableShoes
let datatableDisabledUsers
let proRowSelected
let proRowSelectedData

$(document).ready(function(){
    chargeUsersTable()
})

function chargeUsersTable() {
    datatableShoes = $('#tableShoes')
    .DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'excel'
        ],
        ordering: true,
        iDisplayLength: 50,
        language: {
            url: spanishDataTableLang
        },
        responsive: false,
        columns: [
            { data: 'codePro' },
            { data: 'name' },
            { data: 'brand' },
            { data: 'size' },
            { data: 'color' },
            { data: 'qty'},
            { data: 'category'},
            { data: 'price'}
        ],
        initComplete: function (settings, json) {
            getProEnabled()
        },
        rowCallback: function( row, data ) {
            // if (data.scope == "sadmin") $(row).find('td:eq(5)').html("Super Administrador")
            // if (data.scope == "admin") $(row).find('td:eq(5)').html("Administrador")
        }
    })


    $('#tableShoes tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected')
            $('#optionModShoes').prop('disabled', true)
            $('#optionDeleteShoe').prop('disabled', true)
        } else {
            datatableShoes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#optionModShoes').prop('disabled', false)
            $('#optionDeleteShoe').prop('disabled', false)
            proRowSelectedData = datatableShoes.row($(this)).data()
            proRowSelected = datatableShoes.row($(this))
        }
    })
}

// function cleanData(data){
//     data.rut = ktoK(cleanRut(data.rut))

//     return data
// }

async function getProEnabled() {
    let res = await axios.get('api/products')

    // let cate = await axios.get('api/categories')
    // console.log("categorias", cate.data);
        if (res.err) {
            toastr.warning(res.err)
            $('#loadingUsers').empty()
        } else if(res.data) {

            // let formatRes = res.data.map(el=>{

            //     let rut = validateRut(el.rut)
            //     if (rut.isValid ) {
            //         el.rut = rut.getNiceRut();
            //     }

            //     return el
            // })

            datatableShoes.rows.add(res.data).draw()
            $('#loadingUsers').empty()
        }
}

$('#optionCreateShoe').on('click', function() { // CREAR CLIENTE

    $('#shoesModal').modal('show');
    $('#modal_title').html(`Nuevo calzado`)

    modNewPro()

    $('#saveProd').on('click', async function(){
        saveProd()
        const qrcodePro =$("#codePro").val();
        const qrnamePro =$("#namePro").val();
        const qrbrandPro =$("#brandPro").val();
        const qrsizePro =$("#sizePro").val();
        const qrcolorPro =$("#colorPro").val();
        const qrcategoryPro =$("#categoryPro").val();
        const qrpricePro =$("#pricePro").val();
        const dimension =$("#dimension").val();
        const placeQr =$("#qrImg").attr("src","http://chart.apis.google.com/chart?cht=qr&chl="+qrcodePro+qrnamePro+qrbrandPro+qrsizePro+qrcolorPro+qrcategoryPro+qrpricePro+"&chs="+dimension+"x"+dimension);
     
        const download =$("#downloadQr").attr("href","http://chart.apis.google.com/chart?cht=qr&chl="+qrcodePro+qrnamePro+qrbrandPro+qrsizePro+qrcolorPro+qrcategoryPro+qrpricePro+"&chs="+dimension+"x"+dimension);
    })

});

$('#optionDeleteShoe').on('click', function() {
    deleteUser(proRowSelectedData._id, proRowSelectedData.name, proRowSelectedData.scope)

})

async function deleteUser(_id, name) {
    let result = await Swal.fire({
        title: `Eliminar producto ${name}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        buttonsStyling: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-primary'
        }
    });

    if (result.value) {
        let delPro = await axios.delete(`api/products/${_id}`);

        if (delPro.data.ok) {
            $('#optionModShoes').prop('disabled', true)
            $('#optionDeleteShoe').prop('disabled', true)
            toastr.success(`Producto "${name}" eliminado correctamente`);
            datatableShoes
            .row( proRowSelected )
            .remove()
            .draw()

        } else {
            toastr.warning(`Ha ocurrido un error al intentar eliminar`);
        }
    }
}




$('#optionModShoes').on('click', function() {
    $('#shoesModal').modal('show');
    $('#modal_title').html(`Modificar producto: ${capitalizeAll(proRowSelectedData.name)}`)
    modNewPro(proRowSelectedData)

    let mod = 'yes'
    $('#saveProd').on('click', async function(){
        saveProd(mod)
    })
})

// const rutFunc = (rut) => {
//     return $.formatRut(rut)
// }

function modNewPro(modUserData) {   //NEW AND MOD USER
    $.when($('#modal_body').html(`
    <div class="row">
        <div class="col-md-4" style="margin-top:10px;">
        SKU
            <input id="codePro" type="text" placeholder="SKU" class="form-control border-input">
        </div>
        
        <div class="col-md-4" style="margin-top:10px;">
        Nombre del producto
            <input id="namePro" type="text" placeholder="Nombre del producto" class="form-control border-input">
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Marca del producto
            <input id="brandPro" type="text" placeholder=" producto " class="form-control border-input">
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Talla
            <input id="sizePro" type="text" placeholder="Talla" class="form-control border-input">
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Color
            <input id="colorPro" type="text" placeholder="Color" class="form-control border-input">
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Cantidad
            <input id="qtyPro" type="text" placeholder="Cantidad" class="form-control border-input">
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Categoria
        <select id="categoryPro" class="custom-select">
        <option value="vestir">Vestir</option>
        <option value="escolar">Escolar</option>
        <option value="deporte">Deporte</option>
        <option value="formal">Formal</option>
        <option value="verano">Verano</option>
        <option value="invierno">Invierno</option>
        </select>
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Precio
            <input id="pricePro" type="text" placeholder="Precio" class="form-control border-input">
        </div>
        <div class="col-md-4" style="margin-top:10px;">
        QR
            <div class="div1" id="downloadQr"><img src="#" id="qrImg"></div>
        </div>
        <div class="col-md-4 " style="margin-top:10px; display: none !important;">
        <input type="number" id="dimension" value="200" disabled="">
        </div>

        <div class="col-md-12" id="newUserErrorMessage"></div>

    </div>
`)).then(function () {

    $('#codePro').on('keyup', function() {
        $('#codePro').val((this.value))
    })
    $('#namePro').on('keyup', function() {
        $('#namePro').val((this.value))
    })

    $('#brandPro').on('keyup', function() {
        $('#brandPro').val((this.value))
    })
    $('#sizePro').on('keyup', function() {
        $('#sizePro').val((this.value))
    })
    $('#colorPro').on('keyup', function() {
        $('#colorPro').val((this.value))
    })
    $('#qtyPro').on('keyup', function() {
        $('#qtyPro').val((this.value))
    })
    $('#categoryPro').on('keyup', function() {
        $('#categoryPro').val((this.value))
    })
    $('#pricePro').on('keyup', function() {
        $('#pricePro').val((this.value))
    })

    if (!modUserData) {
        setTimeout(() => {
            $('#codePro').focus()
        }, 500)
    } else {
        $('#codePro').val(modUserData.codePro);
        $('#codePro').attr('readOnly', true);
        $('#namePro').val(modUserData.name);
        $('#brandPro').val(modUserData.brand);
        $('#sizePro').val(modUserData.size);

        // if (modUserData.scope == 'admin' || modUserData.scope == 'Administrador') {
        //     // $('#newUserRole').val('admin').trigger("change");
        //     $('#newUserRole').val('Administrador');
        // } else if (modUserData.scope == 'sadmin' || modUserData.scope == 'Super Administrador') {
        //     $('#newUserRole').val('Super Administrador');
        // }

        $('#colorPro').val(modUserData.color);
        $('#qtyPro').val(modUserData.qty);
        $('#categoryPro').val(modUserData.category);
        $('#pricePro').val(modUserData.price);

    }
    
//-------------------------------------------------------------


    });

    $('#modal_footer').html(`
        <button class="btn btn-dark" data-dismiss="modal">
            <i style="color:#e74c3c;" class="fas fa-times"></i> Cancelar
        </button>

        <button class="btn btn-dark" id="saveProd">
            <i style="color:#3498db;" class="fas fa-check"></i> Guardar
        </button>
    `)

}

function showPass() {
    var x = document.getElementById("newUserPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

async function saveProd(mod) {

    let userData = {
        codePro: ($('#codePro').val()),
        name: ($('#namePro').val()),
        brand: $('#brandPro').val(),
        size: $('#sizePro').val(),
        color: $('#colorPro').val(),
        qty: $('#qtyPro').val(),
        category: $('#categoryPro').val(),
        price: $('#pricePro').val()
    }
    if (mod) userData.mod = mod

    console.log("antes validacion", userData);

    let validUser = await validateUserData(userData)

    if (validUser) {
        let saveProdRes = await axios.post('/api/product', userData)
        if(!saveProdRes.data.error) {
            if (mod) {
                toastr.success('El producto se ha modificado correctamente')

                // if (saveProdRes.data.scope == 'admin') saveProdRes.data.scope = "Administrador"
                // if (saveProdRes.data.scope == 'sadmin') saveProdRes.data.scope = "Super Administrador"

                $('#optionModShoes').prop('disabled', true)
                $('#optionDeleteShoe').prop('disabled', true)

                console.log("selected",proRowSelected);
                datatableShoes
                .row( proRowSelected )
                .remove()
                .draw()

                let modUserAdded = datatableShoes
                .row.add(saveProdRes.data)
                .draw()
                .node();

                //datatableShoes.search('').draw();

                $(modUserAdded).css( 'color', '#1abc9c' )
                setTimeout(() => {
                    $(modUserAdded).css( 'color', '#484848' )
                }, 5000);

                $('#shoesModal').modal('hide')

            } else {
                toastr.success('El producto se ha creado correctamente')

                // let rut = validateRut(saveProdRes.data.rut)
                // if (rut.isValid ) {
                //     saveProdRes.data.rut = rut.getNiceRut()
                // }

                // if (saveProdRes.data.scope == 'admin') saveProdRes.data.scope = "Administrador"
                // if (saveProdRes.data.scope == 'sadmin') saveProdRes.data.scope = "Super Administrador"

                $('#optionModShoes').prop('disabled', true)
                $('#optionDeleteShoe').prop('disabled', true)

                let newUserAdded = datatableShoes
                    .row.add(saveProdRes.data)
                    .draw()
                    .node();
    
                $(newUserAdded).css('color', '#1abc9c');
                setTimeout(() => {
                    $(newUserAdded).css('color', '#484848');
                }, 5000);
    
                $('#shoesModal').modal('hide')
            }
        } else {
            toastr.warning(saveProdRes.data.error)
        }

    } else {
        toastr.warning('Ha ocurrido un error al crear el producto, por favor intentelo nuevamente')
    }

}

async function validateUserData(userData) {
    console.log(userData)
    let validationCounter = 0
    let errorMessage = ''

    // 8 puntos
    if(userData.codePro.length > 1) { // 1
        validationCounter++
        $('#codePro').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar el nombre del producto`
        $('#codePro').css('border', '1px solid #e74c3c')
    }

    if(userData.name.length > 1) { // 2
        validationCounter++
        $('#namePro').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar el nombre del producto`
        $('#namePro').css('border', '1px solid #e74c3c')
    }

    if(userData.brand.length > 1) { // 3
        validationCounter++
        $('#brandPro').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar marca del producto</b>`
        $('#brandPro').css('border', '1px solid #e74c3c')
    }

    if(userData.size.length > 1) { // 4
        validationCounter++
        $('#sizePro').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar una talla de producto`
        $('#sizePro').css('border', '1px solid #e74c3c')
    }

    if(userData.color.length > 1) { // 5
        validationCounter++
        $('#colorPro').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar un color de producto`
        $('#colorPro').css('border', '1px solid #e74c3c')
    }

    if(userData.qty.length > 1) { // 6
        validationCounter++
        $('#qtyPro').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar una talla de producto`
        $('#qtyPro').css('border', '1px solid #e74c3c')
    }

    if(userData.category.length > 1) { // 7
        validationCounter++
        $('#categoryPro').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar una categoria de producto`
        $('#categoryPro').css('border', '1px solid #e74c3c')
    }

    if(userData.price.length > 1) { // 8
        validationCounter++
        $('#pricePro').css('border', '1px solid #3498db')
    } else {
        errorMessage += `<br>Debe ingresar un precio de producto`
        $('#pricePro').css('border', '1px solid #e74c3c')
    }

    console.log('validation', validationCounter)
    if(validationCounter == 8) {
        $('#newUserErrorMessage').empty()
        return {ok: userData}
    } else {
        $('#newUserErrorMessage').html(`
        <div class="alert alert-dismissible alert-warning">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <h4 class="alert-heading">Debe solucionar los siguientes errores</h4>
            <p class="mb-0">${errorMessage}</p>
        </div>
        `)

        return {err: userData}
    }
}