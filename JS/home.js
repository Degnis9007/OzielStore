// Obtener los elementos del DOM
const btnlogin = document.getElementById("btnlogin");
const url_products = "http://127.0.0.1:5000/products"; // URL para obtener productos
const btnProducts = document.getElementById("btn-products");
const productList = document.getElementById("product-list");
const productsTitle = document.getElementById("products-title");
const filters = document.getElementById("filters");
const categoryFilter = document.getElementById("category-filter");
const supplierFilter = document.getElementById("supplier-filter");

// Variable para almacenar todos los productos
let todosLosProductos = [];

// Función que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    cargar_productos(); // Cargar los últimos productos inicialmente
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Cambiar el texto del botón de login dependiendo si el usuario está logueado o no
    if (isLoggedIn === "true") {
        btnlogin.textContent = "Cerrar Sesión";
    } else {
        btnlogin.textContent = "Iniciar Sesión";
    }
});

// Agregar un evento al botón de login
btnlogin.addEventListener("click", function () {
    // Si el texto del botón es "Cerrar Sesión", cerrar sesión
    if (btnlogin.textContent === "Cerrar Sesión") {
        localStorage.removeItem("isLoggedIn"); // Eliminar el estado de sesión
        localStorage.setItem("isLoggedIn", "false"); // Establecer sesión como no iniciada
        window.location.reload(); // Recargar la página
    }
});

// Agregar un evento al botón de productos
btnProducts.addEventListener("click", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Verificar si el usuario está logueado
    if (isLoggedIn) {
        cargar_productos(true); // Si está logueado, cargar todos los productos
        productsTitle.textContent = "Todos Nuestros Productos"; // Cambiar el título
        filters.style.display = "block"; // Mostrar los filtros
    } else {
        alert("Por favor, inicia sesión para ver el catálogo completo.");
    }
});

// Agregar eventos para los filtros
categoryFilter.addEventListener("change", aplicarFiltros);
supplierFilter.addEventListener("change", aplicarFiltros);

// Función para cargar los productos desde la API
async function cargar_productos(mostrarTodo = false) {
    try {
        const respuesta = await fetch(url_products, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta fue exitosa
        if (respuesta.ok) {
            const productos = await respuesta.json(); // Convertir la respuesta a JSON
            todosLosProductos = productos; // Almacenar todos los productos

            // Determinar qué productos mostrar (los últimos 3 o todos)
            const productosAMostrar = mostrarTodo ? productos : productos.slice(-3).reverse();
            productList.innerHTML = ""; // Limpiar la lista antes de mostrar nuevos productos
            mostrarProductos(productosAMostrar); // Mostrar los productos
        }
    } catch (error) {
        console.error(error); // Manejar cualquier error de la petición
    }
}

// Función para mostrar los productos en el HTML
function mostrarProductos(productos) {
    productList.innerHTML = ""; // Limpiar la lista antes de mostrar
    productos.forEach(producto => {
        // Crear un elemento para cada producto
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        const img = document.createElement("img");
        img.src = "./images/" + producto.image;
        img.alt = producto.name;
        productItem.appendChild(img);

        const productName = document.createElement("h3");
        productName.textContent = producto.name;
        productItem.appendChild(productName);

        const price = document.createElement("p");
        price.textContent = `$${producto.price}`;
        productItem.appendChild(price);

        // Crear el botón "Agregar al carrito"
        const button = document.createElement("button");
        button.classList.add("btn-primary", "add-to-cart");
        button.textContent = "Agregar al carrito";
        // Añadir datos del producto al botón
        button.dataset.id = producto.id;
        button.dataset.name = producto.name;
        button.dataset.price = producto.price;
        productItem.appendChild(button);

        productList.appendChild(productItem); // Añadir el producto a la lista
    });

    // Añadir evento de clic a cada botón "Agregar al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            const productName = e.target.dataset.name;
            const productPrice = parseFloat(e.target.dataset.price);

            // Llamar a la función addToCart del archivo cart.js para agregar el producto al carrito
            addToCart({ id: productId, name: productName, price: productPrice });
        });
    });
}

// Función para aplicar los filtros de categoría y proveedor
function aplicarFiltros() {
    const categoria = categoryFilter.value; // Obtener valor de la categoría seleccionada
    const proveedor = supplierFilter.value; // Obtener valor del proveedor seleccionado

    // Filtrar los productos según la categoría y proveedor
    const productosFiltrados = todosLosProductos.filter(producto => {
        const esCategoriaValida = categoria === "" || producto.image.startsWith(categoria); // Filtrar por categoría
        const esProveedorValido = proveedor === "" || producto.supplier_id.toString() === proveedor; // Filtrar por proveedor
        return esCategoriaValida && esProveedorValido;
    });

    // Mostrar los productos filtrados
    mostrarProductos(productosFiltrados);
}
