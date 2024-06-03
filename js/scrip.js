let productos = JSON.parse(localStorage.getItem("productos")) || [];
console.log(productos)
const text = document.getElementById('buscar');
const catalogoContainer1 = document.getElementById("catalogo");
const catalogoContainer12 = document.getElementById("catalogo2");
const contentContainer = document.getElementById('catalogo');
const prevBtnt = document.getElementById('prevBtnt');
const nextBtnt = document.getElementById('nextBtnt');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const mostrarBtn = document.getElementById('mostrarBtn');
const page_num = document.getElementById('numero-pagina');

let productosFiltrados = [];
let currentIndex = 0;
const productosPorPagina = 15;
const productosPorPaginaTabla = 6;



function prevItemt() {
    if (currentIndex > 0) {
        currentIndex--;
        filtrarTabla();
    }
}

function nextItemt() {
    if ((currentIndex + 1) * productosPorPaginaTabla < productosFiltrados.length) {
        currentIndex++;
        filtrarTabla();
    }
}

function filtrarTabla() {
    if(prevBtnt && nextBtnt){
        const filtro1 = document.getElementById("filtro1").value;
        const filtro2 = document.getElementById("filtro2").value;
        const tableBody = document.getElementById('tableBody'); 
    
    productosFiltrados = [...productos];
    const inicio = currentIndex * productosPorPaginaTabla;
    const fin = inicio + productosPorPaginaTabla;

    if (filtro1) {
        switch (filtro1) {
            case "1":
                productosFiltrados.sort((a, b) => a.precio - b.precio);
                break;
            case "2":
                productosFiltrados.sort((a, b) => b.precio - a.precio);
                break;
            case "3":
                productosFiltrados = productosFiltrados.filter(producto => producto.precio >= 0 && producto.precio <= 300);
                break;
            case "4":
                productosFiltrados = productosFiltrados.filter(producto => producto.precio > 300 && producto.precio <= 800);
                break;
            case "5":
                productosFiltrados = productosFiltrados.filter(producto => producto.precio > 800);
                break;
        }
    }

    if (filtro2) {
        let tipo = "";

        switch (filtro2) {
            case "1":
                tipo = "electronica";
                break;
            case "2":
                tipo = "cuidado personal";
                break;
            case "3":
                tipo = "mecanica";
                break;
            case "4":
                tipo = "varios";
                break;
            case "5":
                tipo = "ejercicio";
                break;
        }

        productosFiltrados = productosFiltrados.filter(producto => producto.tipo === tipo);
    }
    if (tableBody) {
        tableBody.innerHTML = productosFiltrados.slice(inicio, fin).map(producto => `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.tipo}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio}</td>
                <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50"></td>
                <td>${producto.codigo}</td>
            </tr>
        `).join('');
    }

    if (prevBtnt && nextBtnt) {
        prevBtnt.disabled = currentIndex === 0;
        nextBtnt.disabled = fin >= productosFiltrados.length;
    }

    if (page_num) {
        page_num.textContent = `Página ${currentIndex + 1}`;
    }
    
}}




function buscar() {
    catalogoContainer1.remove();
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const textInput = document.getElementById("buscar").value;
            let productosFiltrados = productos.filter(producto => producto.nombre.startsWith(textInput));
            console.log(textInput);
            console.log("inicio");
            console.log(productosFiltrados);

            productosFiltrados.forEach(producto => {
                let productoHTML = `
                    <div class="producto">
                        <div class="imagen">
                            <img src="${producto.imagen}" alt="${producto.nombre}">
                        </div>
                        <h3>${producto.nombre}</h3>
                        <p>Precio: $${producto.precio}</p>
                        <p>Categoria: ${producto.tipo}</p>
                        <p>${producto.agotado ? 'Agotado' : 'Disponible'}</p>
                        <button class="boton" type="button">Comprar</button>
                    </div>
                `;
                if(catalogoContainer12){
                    catalogoContainer12.innerHTML += productoHTML;
                    
                }
            });

            resolve(productosFiltrados); 
        }, 2000); 
    });
}


function marcarAgotados() {
    productos.forEach(producto => {
        if (producto.codigo === 0) {
            producto.agotado = true;
        }
    });
}

document.querySelectorAll('.boton').forEach(boton => {
    boton.addEventListener('click', (event) => {
        const carritoSpan = document.querySelector('.carrito');
        aumentarCarrito(carritoSpan);
    });
});
function aumentarCarrito(carritoSpan) {
    
    if (carritoSpan) {
       
        let codigo = parseInt(carritoSpan.textContent);

        
        if (!isNaN(codigo)) {
            
            codigo++;

           
            carritoSpan.textContent = codigo;
        } else {
            console.error('El contenido del <span> no es un número válido');
        }
    } else {
        console.error('El elemento con clase "codigo" no existe');
    }
}
// -----------------------esto no lo ocupo---------------
function mostrarProductos() {
    let productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
    }
    console.log('Contenido del array productos:', productos);
}

function eliminar(){
    productos.pop();
    console.log(productos);
    localStorage.setItem('productos', JSON.stringify(productos));

}
function codigoValido(password) {
    //esto tampoco sabia que existia lo saque de chat gpt pero aprendo en el proceso
    const minLength = 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const numCount = (password.match(/\d/g) || []).length;

    return password.length >= minLength && hasLowercase && hasUppercase && numCount >= 2;
}
function agregarproducto() {
    console.log('Iniciando función agregarproducto');

    const nombre = document.getElementById('nombre').value.trim();
    const select = document.getElementById('categoria');
    const valorSeleccionado = select.value;
    const textoSeleccionado = select.options[select.selectedIndex].text;
    const precio = document.getElementById('precio').value.trim();
    const codigo = document.getElementById('codigo').value.trim();
    const imagen = document.getElementById('imagen').value; // Obtener el nombre del archivo seleccionado

    console.log('Valores obtenidos del formulario:', { nombre, valorSeleccionado, textoSeleccionado, precio, codigo, imagen });

    if (!nombre || !(nombre.length < 21)) {
        console.error('El campo nombre está vacío o es mayor a 20 caracteres.');
        alert('Por favor, ingrese un nombre o un nombre menor a 20 caracteres.');
        return;
    }
    if (!valorSeleccionado) {
        console.error('No se ha seleccionado una categoría.');
        alert('Por favor, seleccione una categoría.');
        return; 
    }
    if (!precio || isNaN(precio)) {
        console.error('El campo precio está vacío o no es un número válido.');
        alert('Por favor, ingrese un precio válido.');
        return;
    }
    if (!codigo || !codigoValido(codigo)) {
        console.error('El campo codigo está vacío o no es un codigo valido.');
        alert('Por favor, ingrese un codigo válido.');
        return;
    }
    if (!imagen) {
        console.error('No se ha seleccionado una imagen.');
        alert('Por favor, seleccione una imagen.');
        return;
    }

    const newProducto = {
        nombre: nombre,
        tipo: textoSeleccionado,
        codigo: parseInt(codigo),
        precio: parseFloat(precio),
        imagen: "../img/fotos2/"+"img" + imagen+".jpg", // Utilizar la propiedad value del elemento input
    };

    productos.push(newProducto);
    console.log('Producto agregado:', newProducto);
    console.log('Longitud del array productos:', productos.length);
    console.log('Contenido del array productos:', productos);
    // Almacenar los productos en localStorage
    localStorage.setItem('productos', JSON.stringify(productos));

}

function limpiarCampos() {
   
    document.getElementById('nombre').value = '';
    document.getElementById('categoria').selectedIndex = 0;
    document.getElementById('precio').value = '';
    document.getElementById('imagen').selectedIndex = 0;
    document.getElementById('codigo').value = '';
    
    
}

function prevItem() {
    if (currentIndex > 0) {
        currentIndex--;
        updateContent();
    }
}
function nextItem() {
    if ((currentIndex + 1) * productosPorPagina < productos.length) {
        currentIndex++;
        updateContent();
    }
}
// Actualizar contenido inicial
updateContent();
function updateContent() {
    const inicio = currentIndex * productosPorPagina;
    const fin = inicio + productosPorPagina;
    if(contentContainer){
        contentContainer.innerHTML = productos.slice(inicio, fin).map(producto => `
        <div class="producto">
            <div class="imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Categoría: ${producto.tipo}</p>
            <p>codigo: ${producto.codigo}</p>
            <button class="boton" type="button" id="boton" >Comprar</button>
        </div>
    `).join('');
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = fin >= productos.length;
      }
      if (page_num) {
        page_num.textContent = `Página ${currentIndex + 1}`;
    }
    
}
marcarAgotados();
updateContent();
//bibliografia
//https://www.youtube.com/watch?v=9he4OewlYFo&ab_channel=Emprinnos
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
//https://www.youtube.com/watch?v=0XzzhmMJd2A&ab_channel=Aprogramar
//https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
//https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/join