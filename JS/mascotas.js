const listaMascotas = document.getElementById("lista-mascotas");
const tipo = document.getElementById("tipo");
const nombre = document.getElementById("nombre");
const dueno = document.getElementById("dueno");
const form = document.getElementById("form");
const botonGuardar = document.getElementById("guardar");

let mascotas = [
    {
        tipo:"Gato",
        nombre: "Martín",
        dueno: "Alejandro"
    },
    {  
        tipo: "Perro",
        nombre: "Paul",
        dueno: "Gustavo"
    },
    {
        tipo: "Perro",
        nombre: "Thor",
        dueno: "Gonzalo"
    }
];

function listarMascotas (){
    const htmlMascotas = mascotas.map((mascota, indice)=>
    `<tr>
    <th scope="row">${indice}</th>
    <td>${mascota.tipo}</td>
    <td>${mascota.nombre}</td>
    <td>${mascota.dueno}</td>
    <td>
    <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-info editar" ><i class="fas fa-edit"></i></button>
        <button type="button" class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
    </div>
    </td>
    </tr>`
    ).join(" ")
    listaMascotas.innerHTML = htmlMascotas;
}

function enviarDatos(evento){
    evento.preventDefault();
    const datos = {
        tipo: tipo.value,
        nombre: nombre.value,
        dueno: dueno.value
    };
    mascotas.push(datos);
    listarMascotas();
}

listarMascotas();

form.onsubmit = enviarDatos;
botonGuardar.onclick = enviarDatos;