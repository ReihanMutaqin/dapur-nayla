function displayAdminProducts() {
    let adminProductList = document.getElementById("admin-product-list");
    if (!adminProductList) return;

    let products = JSON.parse(localStorage.getItem("products")) || [];
    adminProductList.innerHTML = "";

    products.forEach((product, index) => {
        adminProductList.innerHTML += `
            <div class="col-md-4">
                <div class="product-card p-3">
                    <h5>${product.name}</h5>
                    <p>Rp ${product.price} | Stok: <span id="admin-stock-${index}">${product.stock}</span></p>
                    <button class="btn btn-primary w-100" onclick="changeStock(${index}, 1)">+ Tambah Stok</button>
                    <button class="btn btn-warning w-100 mt-2" onclick="changeStock(${index}, -1)">- Kurangi Stok</button>
                    <button class="btn btn-danger w-100 mt-2" onclick="deleteProduct(${index})">Hapus</button>
                </div>
            </div>
        `;
    });
}

function addProduct() {
    let name = document.getElementById("name").value;
    let price = parseInt(document.getElementById("price").value);
    let stock = parseInt(document.getElementById("stock").value);

    let products = JSON.parse(localStorage.getItem("products")) || [];
    let newProduct = { name, price, stock };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    displayAdminProducts();
}

function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayAdminProducts();
}

function changeStock(index, amount) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products[index].stock += amount;
    if (products[index].stock < 0) products[index].stock = 0;
    localStorage.setItem("products", JSON.stringify(products));
    displayAdminProducts();
}

document.addEventListener("DOMContentLoaded", displayAdminProducts);
