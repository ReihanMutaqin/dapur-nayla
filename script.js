let products = JSON.parse(localStorage.getItem("products")) || [];

// Menampilkan produk di halaman utama
function displayProducts() {
    let menu = document.getElementById("menu");
    menu.innerHTML = "";
    products.forEach((product, index) => {
        let item = document.createElement("div");
        item.className = "item";
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Rp ${product.price}</p>
            <input type="number" value="1" min="1" id="qty-${index}">
            <button onclick="addToCart(${index})"><i class="fas fa-shopping-cart"></i> Tambah</button>
        `;
        menu.appendChild(item);
    });
}

// Menambahkan produk ke keranjang
function addToCart(index) {
    let quantity = document.getElementById(`qty-${index}`).value;
    let product = products[index];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name: product.name, quantity });
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Admin - Tambah Produk
function addProduct() {
    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let imageFile = document.getElementById("image").files[0];

    if (!name || !price || !imageFile) {
        alert("Semua field harus diisi!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(event) {
        let product = { name, price, image: event.target.result };
        products.push(product);
        localStorage.setItem("products", JSON.stringify(products));
        renderAdminProducts();
    };
    reader.readAsDataURL(imageFile);
}

// Admin - Hapus Produk
function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    renderAdminProducts();
}

// Menampilkan produk di halaman admin
function renderAdminProducts() {
    let list = document.getElementById("product-list");
    list.innerHTML = "";
    products.forEach((product, index) => {
        let item = document.createElement("div");
        item.className = "product-item";
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Rp ${product.price}</p>
            <button onclick="deleteProduct(${index})"><i class="fas fa-trash"></i> Hapus</button>
        `;
        list.appendChild(item);
    });
}

// Menjalankan fungsi saat halaman dimuat
if (document.getElementById("menu")) displayProducts();
if (document.getElementById("product-list")) renderAdminProducts();
