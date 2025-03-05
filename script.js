document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    updateCartCount();
    renderCart();
    setupDeliveryOption();
});

function loadProducts() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach((product, index) => {
        let productCard = document.createElement("div");
        productCard.className = "col-md-4 mb-3";
        productCard.innerHTML = `
            <div class="card product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body text-center">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Rp ${product.price.toLocaleString()} | Stok: <span id="stock-${index}">${product.stock}</span></p>
                    <button class="btn btn-primary" onclick="addToCart(${index})" ${product.stock <= 0 ? "disabled" : ""}>Tambah</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

function addToCart(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (products[index].stock <= 0) {
        alert("Stok habis!");
        return;
    }

    let item = cart.find(item => item.id === products[index].id);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ id: products[index].id, name: products[index].name, price: products[index].price, quantity: 1 });
    }

    products[index].stock--;
    document.getElementById(`stock-${index}`).innerText = products[index].stock;

    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    renderCart();
}

function toggleCart() {
    let cartPopup = document.getElementById("cart-popup");
    cartPopup.style.display = (cartPopup.style.display === "none" || cartPopup.style.display === "") ? "block" : "none";
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").innerText = total;
}

function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<li class='list-group-item text-center'>Keranjang kosong</li>";
        return;
    }

    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            ${item.name} x<span id="cart-quantity-${index}">${item.quantity}</span> - Rp ${item.price.toLocaleString()}
            <div>
                <button class="btn btn-sm btn-warning" onclick="decreaseQuantity(${index})">➖</button>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">🗑</button>
            </div>
        `;
        cartItems.appendChild(li);
    });
}

function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];

    let item = cart[index];
    let product = products.find(p => p.id === item.id);

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart.splice(index, 1); // Jika quantity = 1, hapus item dari keranjang
    }

    if (product) {
        product.stock++; // Tambah stok kembali saat dikurangi
    }

    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    renderCart();
    loadProducts();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];

    let item = cart[index];
    let product = products.find(p => p.id === item.id);
    if (product) {
        product.stock += item.quantity;
    }

    cart.splice(index, 1);

    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    renderCart();
    loadProducts();
}

function setupDeliveryOption() {
    document.getElementById("delivery-option").addEventListener("change", function () {
        document.getElementById("customer-address").style.display = this.value === "diantar" ? "block" : "none";
    });
}

function checkout() {
    let name = document.getElementById("customer-name").value;
    let delivery = document.getElementById("delivery-option").value;
    let address = document.getElementById("customer-address").value;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    let message = `📦 *Pesanan dari Dapur Nayla:*\n`;
    cart.forEach(item => message += `- ${item.name} x${item.quantity}\n`);
    message += `\n📍 *Pengiriman*: ${delivery === "diantar" ? `Diantar ke: ${address}` : "Diambil"}\n👤 *Atas nama*: ${name}`;

    localStorage.removeItem("cart");
    updateCartCount();
    renderCart();
    loadProducts();

    window.open(`https://wa.me/+6282111039958?text=${encodeURIComponent(message)}`);
}
