function displayProducts() {
    let productList = document.getElementById("product-list");
    if (!productList) return;

    let products = JSON.parse(localStorage.getItem("products")) || [];
    productList.innerHTML = "";

    products.forEach((product, index) => {
        productList.innerHTML += `
            <div class="col-md-4">
                <div class="product-card p-3">
                    <img src="${product.image}" class="img-fluid mb-2" style="height: 150px; object-fit: cover;">
                    <h5>${product.name}</h5>
                    <p>Rp ${product.price} | Stok: <span id="stock-${index}">${product.stock}</span></p>
                    <button class="btn btn-success w-100" onclick="addToCart(${index})" ${product.stock <= 0 ? 'disabled' : ''}>Tambah</button>
                </div>
            </div>
        `;
    });
}

// Fungsi Menambah Produk ke Keranjang
function addToCart(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let product = products[index];

    if (product.stock <= 0) {
        alert("Stok habis!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingItem = cart.find(item => item.name === product.name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: product.name, price: product.price, quantity: 1, image: product.image });
    }

    product.stock--;
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("cart", JSON.stringify(cart));

    displayProducts();
    updateCartCount();
}

// Fungsi Update Jumlah Produk di Keranjang
function updateCartCount() {
    let cartCount = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
}

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
    updateCartCount();
});
