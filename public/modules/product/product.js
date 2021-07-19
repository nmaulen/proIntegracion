let datatableShoes
let datatableDisabledUsers
let userRowSelected
let userRowSelectedData

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
            { data: 'code' },
            { data: 'name' },
            { data: 'brand' },
            { data: 'size' },
            { data: 'color' },
            { data: 'qty'},
            { data: 'category'},
            { data: 'price'}
        ],
        initComplete: function (settings, json) {
            getUsersEnabled()
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
            userRowSelectedData = cleanData(datatableShoes.row($(this)).data())
            userRowSelected = datatableShoes.row($(this))
        }
    })
}

// function cleanData(data){
//     data.rut = ktoK(cleanRut(data.rut))

//     return data
// }

async function getUsersEnabled() {
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

    modNewUser()

    $('#saveProd').on('click', async function(){
        saveProd()
    })

});

$('#optionDeleteShoe').on('click', function() {
    deleteUser(userRowSelectedData._id, userRowSelectedData.name, userRowSelectedData.scope)

})

async function deleteUser(_id, name, rol) {
    console.log("rol", rol);
    if (rol !== "sadmin") {
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
            //let delUser = await axios.delete(`api/users/${_id}`);
    
            if (delUser.data.ok) {
                $('#optionModShoes').prop('disabled', true)
                $('#optionDeleteShoe').prop('disabled', true)
                toastr.success(`producto "${name}" eliminado correctamente`);
                datatableShoes
                .row( userRowSelected )
                .remove()
                .draw()
    
            } else {
                toastr.warning(`Ha ocurrido un error al intentar eliminar`);
            }
        }
    }
    toastr.warning(`producto "${name}" no puede ser eliminado`);

}




$('#optionModShoes').on('click', function() {
    $('#shoesModal').modal('show');
    $('#modal_title').html(`Modificar producto: ${capitalizeAll(userRowSelectedData.name)} ${capitalizeAll(userRowSelectedData.lastname)}`)
    modNewUser(userRowSelectedData)

    let mod = 'yes'
    $('#saveProd').on('click', async function(){
        saveProd(mod)
    })
})

const rutFunc = (rut) => {
    return $.formatRut(rut)
}

function modNewUser(modUserData) {   //NEW AND MOD USER
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
        <option value="invierno">Invierno/<option>
        </select>
        </div>

        <div class="col-md-4" style="margin-top:10px;">
        Precio
            <input id="pricePro" type="text" placeholder="Precio" class="form-control border-input">
        </div>

        <div class="col-md-12" id="newUserErrorMessage"></div>

    </div>
`)).then(function () {

    $('#codePro').on('keyup', function() {
        $('#codePro').val((this.value))
    })
    $('#namePro').on('keyup', function() {
        $('#namePro').val((this.value))
        // if (rut.isValid ) {
        //     $('#namePro').val(rut.getNiceRut())
        // }
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
            $('#namePro').focus()
        }, 500)
    } else {
        // let ruto = validateRut(modUserData.rut)
        // let rutVal
        // if (ruto.isValid ) {
        //     rutVal = ruto.getNiceRut()
        // } else {
        //     rutVal = modUserData.rut
        // }
        // $('#namePro').val(rutVal);
        $('#namePro').attr('readOnly', true);
        $('#brandPro').val(modUserData.name);
        $('#sizePro').val(modUserData.lastname);

        // if (modUserData.scope == 'admin' || modUserData.scope == 'Administrador') {
        //     // $('#newUserRole').val('admin').trigger("change");
        //     $('#newUserRole').val('Administrador');
        // } else if (modUserData.scope == 'sadmin' || modUserData.scope == 'Super Administrador') {
        //     $('#newUserRole').val('Super Administrador');
        // }

        $('#newUserPhone').val(modUserData.phone);
        $('#newUserEmail').val(modUserData.email);

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
        name: ($('#namePro').val()),
        brand: $('#brandPro').val(),
        size: $('#sizePro').val(),
        color: $('#colorPro').val(),
        qty: $('#qtyPro').val(),
        category: $('#categoryPro').val(),
        price: $('#pricePro').val()
    }
    if (mod) userData.mod = mod

    let validUser = await validateUserData(userData)

    if (validUser) {
        let saveProdRes = await axios.post('/api/product', userData)
        if(!saveProdRes.data.error) {
            if (mod) {
                toastr.success('El producto se ha modificado correctamente')

                let rut = validateRut(saveProdRes.data.rut)
                if (rut.isValid ) {
                    saveProdRes.data.rut = rut.getNiceRut()
                }

                if (saveProdRes.data.scope == 'admin') saveProdRes.data.scope = "Administrador"
                if (saveProdRes.data.scope == 'sadmin') saveProdRes.data.scope = "Super Administrador"

                $('#optionModShoes').prop('disabled', true)
                $('#optionDeleteShoe').prop('disabled', true)

                datatableShoes
                .row( userRowSelected )
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

                let rut = validateRut(saveProdRes.data.rut)
                if (rut.isValid ) {
                    saveProdRes.data.rut = rut.getNiceRut()
                }

                if (saveProdRes.data.scope == 'admin') saveProdRes.data.scope = "Administrador"
                if (saveProdRes.data.scope == 'sadmin') saveProdRes.data.scope = "Super Administrador"

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

    // return new Promise(resolve=>{
        // 5 puntos

        if(userData.name.length > 1) { // 1
            validationCounter++
            $('#namePro').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar el nombre del producto`
            $('#namePro').css('border', '1px solid #e74c3c')
        }

        if(userData.brand.length > 1) { // 2
            validationCounter++
            $('#brandPro').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar marca del producto</b>`
            $('#brandPro').css('border', '1px solid #e74c3c')
        }

        if(userData.size.length > 1) { // 3
            validationCounter++
            $('#sizePro').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar una talla de producto`
            $('#sizePro').css('border', '1px solid #e74c3c')
        }

        if(userData.color.length > 1) { // 4
            validationCounter++
            $('#colorPro').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar un color de producto`
            $('#colorPro').css('border', '1px solid #e74c3c')
        }

        if(userData.qty.length > 1) { // 5
            validationCounter++
            $('#qtyPro').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar una talla de producto`
            $('#qtyPro').css('border', '1px solid #e74c3c')
        }

        if(userData.category.length > 1) { // 6
            validationCounter++
            $('#categoryPro').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar una categoria de producto`
            $('#categoryPro').css('border', '1px solid #e74c3c')
        }

        if(userData.price.length > 1) { // 7
            validationCounter++
            $('#pricePro').css('border', '1px solid #3498db')
        } else {
            errorMessage += `<br>Debe ingresar un precio de producto`
            $('#pricePro').css('border', '1px solid #e74c3c')
        }




        // if(userData.phone.length > 1) { // 5
        //     validationCounter++
        //     $('#newUserPhone').css('border', '1px solid #3498db')
        // } else {
        //     errorMessage += `<br>Debe ingresar el teléfono del producto`
        //     $('#newUserPhone').css('border', '1px solid #e74c3c')
        // }

        // if(isEmail(userData.email)) { // 6
        //     validationCounter++
        //     $('#newUserEmail').css('border', '1px solid #3498db')
        // } else {
        //     errorMessage += `<br>Debe ingresar el correo del producto`
        //     $('#newUserEmail').css('border', '1px solid #e74c3c')
        // }

        // if (userData.mod == 'yes') {

        //     if(userData.changePassword) {
        //         if(userData.password.length > 1) { // 4
        //             validationCounter++
        //             $('#modUserPassword').css('border', '1px solid #3498db')
        //         } else {
        //             errorMessage += `<br>Debe ingresar una contraseña`
        //             $('#modUserPassword').css('border', '1px solid #e74c3c')
        //         }
        //     } else {
        //         validationCounter++
        //     }

        // } else {
        //     if(userData.password.length > 5) { // 4
        //         validationCounter++
        //         $('#newUserPassword').css('border', '1px solid #3498db')
        //     } else {
        //         errorMessage += `<br>Debe ingresar una contraseña valida de mas de 5 caracteres`
        //         $('#newUserPassword').css('border', '1px solid #e74c3c')
        //     }

        // }

        console.log('validation', validationCounter)
        if(validationCounter == 7) {
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
    // })
}