const urlApi = "http://localhost:8080/product/";

function listarProductos(){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token

        },
    }
    fetch(urlApi,settings)
        .then(response => response.json())
        .then(function(data){
            var productos = '';
            for(const producto of data){
                productos += '<tr>'+
                    '<th scope="row">'+producto.id+'</th>'+
                    '<td>'+producto.titulo+'</td>'+
                    '<td>'+'$'+producto.precio+'</td>'+
                    '<td>'+producto.categoria+'</td>'+
                    '<td>'+producto.imagen+'</td>'+
                    '<td>'+
                    '<button type="button" class="btn btn-outline-danger" onclick="eliminaProducto(\''+producto.id+'\')"><i class="fa-solid fa-minus"></i></button>'+
                    '<a href="#" onclick="verModificarProducto(\''+producto.id+'\')" class="btn btn-outline-warning"><i class="fa-solid fa-notes-medical"></i></a>'+
                    '<a href="#" onclick="verProducto(\''+producto.id+'\')"class="btn btn-outline-info"><i class="fa-solid fa-eye"></i></a>'+
                    '</td>'+
                    '</tr>';
            }
            document.getElementById("listar").innerHTML = productos;

        })
}




function eliminaProducto(id){
    validaToken()
    var settings={
        method: 'DELETE',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+id,settings)
        .then(response => response.json())
        .then(function(data){

            listarProductos();
            alertas(" Se ha eliminado el producto exitosamente!",2)
        })
}

function verModificarProducto(id){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+id,settings)
        .then(response => response.json())
        .then(function(producto){
            var cadena='';
            if( producto){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Producto</h1>'+
                    '</div>'+
                    '<form action="" method="post" id="modificar">'+
                    ' <label  for="titulo">Nombre</label>'+
                    '<input type="text" class="form-control" name="titulo" id="titulo" value ="'+producto.titulo+'" required> <br>'+
                    '<label  for="precio">Precio</label>'+
                    ' <input type="text" class="form-control" name="precio" id="precio" value ="'+producto.precio+'" required><br>'+
                    '<label  for="categoria">Categoria</label>'+
                    ' <input type="text" class="form-control" name="categoria" id="categoria" value ="'+producto.categoria+'" required><br>'+
                    '<label  for="descripcion">Descripcion</label>'+
                    '  <input type="text" class="form-control" name="descripcion" id="descripcion" value ="'+producto.descripcion+'" required><br>'+
                    '<label  for="imagen">Imagen</label>'+
                    '  <input type="text" class="form-control" name="imagen" id="imagen" value ="'+producto.imagen+'" required><br>'+
                    ' <button type="button" class="btn btn-outline-warning" onclick="modificarProducto(\''+producto.id+'\')">Modificar</button>'+
                    '</form>';
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();



        })
}
async function modificarProducto(id){
    validaToken()
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request =  await fetch(urlApi+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarProductos();
    alertas(" Se ha modificado el producto exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();

}

function verProducto(id){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+id,settings)
        .then(response => response.json())
        .then(function(producto){
            var cadena='';


            if( producto){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Producto</h1>'+
                    '</div>'+
                    '<ul class="list-group">'+
                    '<li class="list-group-item">Nombre: '+producto.titulo+' </li>'+
                    '<li class="list-group-item">Precio: $'+producto.precio+'</li>'+
                    '<li class="list-group-item">Categoria: '+producto.categoria+'</li>'+
                    '<li class="list-group-item">Descripcion: '+producto.descripcion+'</li>'+
                    '<li class="list-group-item">Imagen: '+producto.imagen+'</li>'+
                    //'<li class="list-group-item">Registrado por: '+produc.usuario+'</li>'+
                    '</ul>';
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();

        })
}
function verAgregarProducto(){
    var cadena= '<form action="" method="post" id="myForm">'+
        ' <label  for="titulo">Nombre</label>'+
        '<input type="text" class="form-control" name="titulo" id="titulo" required> <br>'+
        '<label  for="precio">Precio</label>'+
        ' <input type="text" class="form-control" name="precio" id="precio" required><br>'+
        '<label  for="categoria">Categoria</label>'+
        ' <input type="text" class="form-control" name="categoria" id="categoria" required><br>'+
        '<label  for="descripcion">Descripcion</label>'+
        '  <input type="text" class="form-control" name="descripcion" id="descripcion" required><br>'+
        '<label  for="imagen">Imagen</label>'+
        '  <input type="text" class="form-control" name="imagen" id="imagen"  required><br>'+
        ' <button type="button" class="btn btn-success" onclick="sendData()">Registrar Producto</button>'+
        '</form>';
    document.getElementById("contentModal").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
    myModal.toggle();
}
async function sendData(){
    validaToken()
    var myForm = document.getElementById("myForm");
    var titulo=document.getElementById("titulo").value;
    var precio=document.getElementById("precio").value;
    var categoria=document.getElementById("categoria").value;
    var descripcion=document.getElementById("descripcion").value;
    var formData = new FormData(myForm);

    var jsonData = {};
    if((titulo==="" || precio===""||categoria===""||descripcion==="")){
        alertas("¡Campos vacio!",2)
    }else{
        for(var [k, v] of formData){//convertimos los datos a json
            jsonData[k] = v;
        }
        console.log(jsonData);
        const request = await fetch(urlApi, {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            },
            body: JSON.stringify(jsonData)
        });
        alertas(" Se ha registrado el producto exitosamente!",1)
        myForm.reset();
        listarProductos();
        document.getElementById("contentModal").innerHTML = '';
        var myModalEl = document.getElementById('modalUsuario');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
    }
}
function alertas(mensaje,tipo){
    var color="";
    if(tipo==1){//success
        color="success"
    }else{//danger
        color="danger"
    }
    var alerta=
        '<div class="alert alert-'+color+' alert-dismissible fade show" role="alert">'+
        '<strong><i class="fa-solid fa-triangle-exclamation"></i></strong>'+
        mensaje+
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'+
        '</div>'
    document.getElementById("datos").innerHTML = alerta;
    setTimeout(function() {document.getElementById('datos').innerHTML='';},3000);
}

function salir(){
    localStorage.clear();
    location.href="index.html"
}

function validaToken(){
    if(localStorage.token== undefined){
        salir();
    }
}
