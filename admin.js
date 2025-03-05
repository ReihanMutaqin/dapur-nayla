document.addEventListener("DOMContentLoaded", () => {
    loadAdminProducts();
});

function loadAdminProducts() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let productList = document.getElementById("admin-product-list");

    if (products.length === 0) {
        productList.innerHTML = "<li class='list-group-item text-center'>Belum ada produk</li>";
        return;
    }

    productList.innerHTML = ""; // Kosongkan daftar sebelum diisi ulang

    products.forEach((product, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <div>
                <strong>${product.name}</strong> - Rp ${product.price.toLocaleString()} | Stok: ${product.stock}
            </div>
            <div>
                <button class="btn btn-sm btn-success" onclick="updateStock(${index}, 1)">➕</button>
                <button class="btn btn-sm btn-warning" onclick="updateStock(${index}, -1)">➖</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">🗑</button>
            </div>
        `;
        productList.appendChild(li);
    });
}

function addProduct() {
    let name = document.getElementById("product-name").value;
    let price = document.getElementById("product-price").value;
    let stock = document.getElementById("product-stock").value;
    let imageInput = document.getElementById("product-image").files[0];

    if (!name || !price || !stock || !imageInput) {
        alert("Harap isi semua kolom dan pilih gambar!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        let newProduct = {
            id: Date.now(),
            name: name,
            price: parseInt(price),
            stock: parseInt(stock),
            image: e.target.result
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        alert("Produk berhasil ditambahkan!");
        loadAdminProducts(); // Perbarui daftar produk di admin
    };
    reader.readAsDataURL(imageInput);
}

function updateStock(index, amount) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products[index].stock += amount;
    if (products[index].stock < 0) products[index].stock = 0;
    localStorage.setItem("products", JSON.stringify(products));

    loadAdminProducts(); // Perbarui daftar di halaman Admin
}

function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));

    loadAdminProducts();
}
