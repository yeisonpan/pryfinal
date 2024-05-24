let productos = JSON.parse(localStorage.getItem("productos")) || [];
//let productos = JSON.parse(localStorage.getItem("productos"));
const text = document.getElementById('buscar');
const catalogoContainer1 = document.getElementById("catalogo1");
const catalogoContainer12 = document.getElementById("catalogo2");
const contentContainer = document.getElementById('catalogo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const mostrarBtn =document.getElementById('mostrarBtn');
let currentIndex = 0;
const productosPorPagina = 5;


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
                        <p>Cantidad disponible: <span class="cantidad">${producto.cantidad}</span></p>
                        <p>${producto.agotado ? 'Agotado' : 'Disponible'}</p>
                        <button class="boton" type="button">Comprar</button>
                    </div>
                `;
                if(catalogoContainer12){
                    catalogoContainer12.innerHTML += productoHTML;
                    
                }
            });

            resolve(productosFiltrados); // Resolvemos la promesa con los productos filtrados
        }, 3000); // Tiempo de espera de 1000 milisegundos (1 segundo)
    });
}


function marcarAgotados() {
    productos.forEach(producto => {
        if (producto.cantidad === 0) {
            producto.agotado = true;
        }
    });
}

productos.forEach(producto => {
    // const catalogoContainer = document.getElementById("catalogo");
    let productoHTML = `
        <div class="producto">
            <div class="imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Categoria: ${producto.tipo}</p>
            <p>Cantidad disponible: <span class="cantidad">${producto.cantidad}</span></p>
            <p>${producto.agotado ? 'Agotado' : 'Disponible'}</p>
            <button class="boton" type="button">Comprar</button>
        </div>
    `;
    if(catalogoContainer1){
        catalogoContainer1.innerHTML += productoHTML;
    }
    
});
document.querySelectorAll('.boton').forEach(boton => {
    boton.addEventListener('click', (event) => {
        const carritoSpan = document.querySelector('.carrito');
        aumentarCarrito(carritoSpan);
    });
});
function aumentarCarrito(carritoSpan) {
    // Verificar que el elemento cantidadSpan no sea null
    if (carritoSpan) {
        // Obtener el número actual del <span> como un entero
        let cantidad = parseInt(carritoSpan.textContent);

        // Asegurarse de que cantidad sea un número válido
        if (!isNaN(cantidad)) {
            // Aumentar la cantidad en 1
            cantidad++;

            // Actualizar el contenido del <span> con la nueva cantidad
            carritoSpan.textContent = cantidad;
        } else {
            console.error('El contenido del <span> no es un número válido');
        }
    } else {
        console.error('El elemento con clase "cantidad" no existe');
    }
}


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

function agregarproducto() {
    console.log('Iniciando función agregarproducto');

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const select = document.getElementById('categoria');
    const valorSeleccionado = select.value;
    const textoSeleccionado = select.options[select.selectedIndex].text;
    const precio = document.getElementById('precio').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const imagen = document.getElementById('imagen').files[0]; // Obtener el archivo de imagen

    console.log('Valores obtenidos del formulario:', { nombre, valorSeleccionado, textoSeleccionado, precio, cantidad, imagen });

    // Validar los datos del formulario
    if (!nombre) {
        console.error('El campo nombre está vacío.');
        alert('Por favor, ingrese un nombre.');
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
    if (!cantidad || isNaN(cantidad)) {
        console.error('El campo cantidad está vacío o no es un número válido.');
        alert('Por favor, ingrese una cantidad válida.');
        return;
    }
    if (!imagen) {
        console.error('No se ha seleccionado una imagen.');
        alert('Por favor, seleccione una imagen.');
        return;
    }

    // Crear un nuevo objeto producto
    const newProducto = {
        nombre: nombre,
        tipo: textoSeleccionado,
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
        imagen: URL.createObjectURL(imagen) // Crear una URL para la imagen, sacado de chat gpt
    };

    // Agregar el nuevo producto al array de productos
    productos.push(newProducto);
    console.log('Producto agregado:', newProducto);
    console.log('Longitud del array productos:', productos.length);
    console.log('Contenido del array productos:', productos);

    // Limpiar el formulario después de agregar el producto
    document.getElementById('nombre').value = '';
    document.getElementById('categoria').selectedIndex = 0;
    document.getElementById('precio').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('imagen').value = '';

    console.log('Formulario limpiado');

    // Almacenar los productos en localStorage for chat gpt profe esto no sabia que existia
    localStorage.setItem('productos', JSON.stringify(productos));
}

function limpiarCampos() {
    // Limpiar campos de entrada
    document.getElementById('nombre').value = '';
    document.getElementById('categoria').selectedIndex = 0;
    document.getElementById('precio').value = '';
    document.getElementById('imagen').value = '';
    document.getElementById('cantidad').value = '';
    // Opcionalmente, puedes restablecer el valor seleccionado del motivo a su valor predeterminado
    
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
            <p>Cantidad disponible: ${producto.cantidad}</p>
            <p>${producto.agotado ? 'Agotado' : 'Disponible'}</p>
            <button class="boton" type="button" id="mostrarBtn" onclick="aumentar()">Comprar</button>
        </div>
    `).join('');
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = fin >= productos.length;
      }
    
}




marcarAgotados();
updateContent();
//bibliografia
//https://www.youtube.com/watch?v=9he4OewlYFo&ab_channel=Emprinnos
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse