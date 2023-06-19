async function login(){
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    console.log(jsonData);
    var settings={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch("api/auth/login",settings);

    if(request.ok){
        const respuesta = await request.json();
        localStorage.token = respuesta.detail;
        localStorage.email = jsonData.email;
        location.href= "dashboard.html";

    }
}



function listar(){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token

        },
    }
    fetch("api/users",settings)
        .then(response => response.json())
        .then(function(data){

            //if(data.lenght>0){
            var usuarios = '';
            for(const usuario of data){


                usuarios += '<tr>'+
                    '<th scope="row">'+usuario.id+'</th>'+
                    '<td>'+usuario.firstName+'</td>'+
                    '<td>'+usuario.lastName+'</td>'+
                    '<td>'+usuario.email+'</td>'+
                    '<td>'+
                    '<button type="button" class="btn btn-outline-danger" onclick="eliminaUsuario(\''+usuario.id+'\')"><i class="fa-solid fa-user-minus"></i></button>'+
                    '<a href="#" onclick="verModificarUsuario(\''+usuario.id+'\')" class="btn btn-outline-warning"><i class="fa-solid fa-user-pen"></i></a>'+
                    '<a href="#" onclick="verUsuario(\''+usuario.id+'\')"class="btn btn-outline-info"><i class="fa-solid fa-eye"></i></a>'+
                    '</td>'+
                    '</tr>';

                if(localStorage.email==usuario.email){
                    localStorage.nombre = usuario.firstName;
                }
            }

            document.getElementById("listar").innerHTML = usuarios;
            //}
        })

}


function verAgregar(){
    validaToken()
    var s="api/users";
    var cadena='<form action="" method="post" id="myForm">'+
        '<label  for="firstName" class="form-label">First Name</label>'+
        '<input type="text" class="form-control" name="firstName" id="firstName" required> <br>'+
        '<label  for="lastName" class="form-label">last Name</label>'+
        '<input type="text" class="form-control" name="lastName" id="lastName" required><br>'+
        ' <label  for="email" class="form-label" >email</label>'+
        ' <input type="email" class="form-control" name="email" id="email" required><br>'+
        ' <label  for="password" class="form-label">password</label>'+
        ' <input type="password" class="form-control"  name="password" id="password" required><br>'+
        ' <button type="button"  class="btn btn-outline-info" onclick="sendDatas(\''+s+'\')">Registrar</button>'+
        '</form>';
    document.getElementById("contentModal").innerHTML = cadena;
    var myModale = new bootstrap.Modal(document.getElementById('modalUsuario'))
    myModale.toggle();
}

async function sendDatas(path){
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(path, {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },
        body: JSON.stringify(jsonData)
    });
    myForm.reset();
    console.log(await request.text())
    listar();
    alertas(" Se ha registrado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}


function eliminaUsuario(id){
    validaToken()
    var settings={
        method: 'DELETE',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch("api/users/"+id,settings)
        .then(response => response.json())
        .then(function(data){
            listar();
            alertas(" Se ha eliminado el usuario exitosamente!",2)
            var myModalEl = document.getElementById('modalUsuario');
            var modal = bootstrap.Modal.getInstance(myModalEl)

        })
}

function verModificarUsuario(id){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch("api/users/"+id,settings)
        .then(response => response.json())
        .then(function(usuario){
            var cadena='';
            if( usuario){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Usuario</h1>'+
                    '</div>'+
                    '<form action="" method="post" id="myForm" >'+
                    '<input type="hidden" name="id" id="id" value="'+usuario.id+'">'+
                    '<label  for="firstName" class="form-label">First Name</label>'+
                    '<input type="text" class="form-control" name="firstName" id="firstName"  required value="'+usuario.firstName+'"> <br>'+
                    ' <label  for="lastName" class="form-label">last Name</label>'+
                    ' <input type="text" class="form-control" name="lastName" id="lastName" required value="'+usuario.lastName+'"><br>'+
                    ' <label  for="email" class="form-label" >email</label>'+
                    ' <input type="email" class="form-control" name="email" id="email" required value="'+usuario.email+'"><br>'+
                    ' <label  for="password" class="form-label">password</label>'+
                    ' <input type="password" class="form-control"  name="password" id="password" required><br>'+
                    '<button type="button"   class="btn btn-warning" onclick="modificarUsuario(\''+usuario.id+'\')">Modificar</button>'+
                    '</form>';
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();



        })
}

async function modificarUsuario(id){
    validaToken()
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request =  await fetch("api/users/"+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas(" Se ha modificado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();


}

function verUsuario(id){
    validaToken()
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch("api/users/"+id,settings)
        .then(response => response.json())
        .then(function(usuario){
            var cadena='';
            if( usuario){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Usuario</h1>'+
                    '</div>'+
                    '<ul class="list-group">'+
                    '<li class="list-group-item">Nombre: '+usuario.firstName+' </li>'+
                    '<li class="list-group-item">Apellido: '+usuario.lastName+'</li>'+
                    '<li class="list-group-item">Email: '+usuario.email+'</li>'+
                    '</ul>';
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();

        })
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
    fetch("api/products",settings)
        .then(response => response.json())
        .then(function(data){
            var productos = '';
            for(const producto of data){
                productos += '<tr>'+
                    '<th scope="row">'+producto.id+'</th>'+
                    '<td>'+producto.nombre+'</td>'+
                    '<td>'+'$'+producto.precio+'</td>'+
                    '<td>'+producto.marca+'</td>'+
                    '<td>'+producto.disponible+' unidades'+'</td>'+
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
    fetch("api/products/"+id,settings)
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
    fetch("api/products/"+id,settings)
        .then(response => response.json())
        .then(function(producto){
            var cadena='';
            if( producto){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Producto</h1>'+
                    '</div>'+
                    '<form action="" method="post" id="myForm">'+
                    ' <label  for="nombre">Nombre</label>'+
                    '<input type="text" class="form-control" name="nombre" id="nombre" value ="'+producto.nombre+'" required> <br>'+
                    '<label  for="precio">Precio</label>'+
                    ' <input type="text" class="form-control" name="precio" id="precio" value ="'+producto.precio+'" required><br>'+
                    '<label  for="marca">Marca</label>'+
                    ' <input type="text" class="form-control" name="marca" id="marca" value ="'+producto.marca+'" required><br>'+
                    '<label  for="peso">Peso</label>'+
                    '  <input type="text" class="form-control" name="peso" id="peso" value ="'+producto.peso+'" required><br>'+
                    '<label  for="disponible">Productos disponibles</label>'+
                    '  <input type="text" class="form-control" name="disponible" id="disponible" value ="'+producto.disponible+'" required><br>'+
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
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request =  await fetch("api/products/"+id, {
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
    fetch("api/products/"+id,settings)
        .then(response => response.json())
        .then(function(producto){
            var cadena='';
            if( producto){
                cadena='<div class="p-3 mb-2 bg-light text-dark">'+
                    '<h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Producto</h1>'+
                    '</div>'+
                    '<ul class="list-group">'+
                    '<li class="list-group-item">Nombre: '+producto.nombre+' </li>'+
                    '<li class="list-group-item">Precio: $'+producto.precio+'</li>'+
                    '<li class="list-group-item">Marca: '+producto.marca+'</li>'+
                    '<li class="list-group-item">Peso: '+producto.peso+'</li>'+
                    '<li class="list-group-item">Disponibilidad: '+producto.disponible+'</li>'+
                    '<li class="list-group-item">Registrado por: '+producto.usuario+'</li>'+
                    '</ul>';
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();

        })
}
function verAgregarProducto(){
    var s="api/products";
    var cadena= '<form action="" method="post" id="myForm">'+
        ' <input type="hidden" class="form-control" name="usuario" id="usuario" value ="'+localStorage.nombre+'" required>'+
        ' <label  for="nombre">Nombre</label>'+
        '<input type="text" class="form-control" name="nombre" id="nombre" required> <br>'+
        '<label  for="precio">Precio</label>'+
        ' <input type="text" class="form-control" name="precio" id="precio" required><br>'+
        '<label  for="marca">Marca</label>'+
        ' <input type="text" class="form-control" name="marca" id="marca" required><br>'+
        '<label  for="peso">Peso</label>'+
        '  <input type="text" class="form-control" name="peso" id="peso" required><br>'+
        '<label  for="disponible">Productos disponibles</label>'+
        '  <input type="text" class="form-control" name="disponible" id="disponible"  required><br>'+
        ' <button type="button" class="btn btn-success" onclick="sendData(\''+s+'\')">Registrar Producto</button>'+
        '</form>';
    document.getElementById("contentModal").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
    myModal.toggle();
}
async function sendData(path){
    validaToken()
    var myForm = document.getElementById("myForm");
    var nombre=document.getElementById("nombre").value;
    var precio=document.getElementById("precio").value;
    var marca=document.getElementById("marca").value;
    var peso=document.getElementById("peso").value;
    var formData = new FormData(myForm);
    console.log(nombre);
    var jsonData = {};
    if((nombre==="" || precio===""||marca===""||peso==="")){
        alertas("¡Campos vacio!",2)
    }else{
        for(var [k, v] of formData){//convertimos los datos a json
            jsonData[k] = v;
        }
        const request = await fetch(path, {
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
