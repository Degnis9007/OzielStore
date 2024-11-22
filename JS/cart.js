// cart.js o home.js

const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const cartCount = document.getElementById("cart-count");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
let cart = [];

// Inicializar carrito desde localStorage
document.addEventListener("DOMContentLoaded", () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCart();
    }
});

// Manejar clic en el icono del carrito
cartIcon.addEventListener("click", () => {
    cartModal.classList.toggle("hidden");
});

// Manejar clic en el botón de cerrar
closeCartBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

// Función para actualizar el contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Función para actualizar el carrito y mostrarlo en el modal
function updateCart() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach(product => {
        const cartItem = document.createElement("li");
        cartItem.textContent = `${product.name} - $${product.price} x ${product.quantity}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.addEventListener("click", () => removeFromCart(product.id));

        const increaseBtn = document.createElement("button");
        increaseBtn.textContent = "+";
        increaseBtn.addEventListener("click", () => changeQuantity(product.id, 1));

        const decreaseBtn = document.createElement("button");
        decreaseBtn.textContent = "-";
        decreaseBtn.addEventListener("click", () => changeQuantity(product.id, -1));

        cartItem.appendChild(increaseBtn);
        cartItem.appendChild(decreaseBtn);
        cartItem.appendChild(deleteBtn);
        cartList.appendChild(cartItem);

        total += product.price * product.quantity;
    });

    cartTotal.textContent = `Total: $${total}`;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Función para cambiar la cantidad de un producto
function changeQuantity(productId, amount) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += amount;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Función para añadir un producto al carrito
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}
