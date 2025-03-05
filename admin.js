document.addEventListener("DOMContentLoaded", () => {
    loadAdminProducts();
});

function loadAdminProducts() {
    fetch("data.json")
        .then(response => response.json())
        .then(products => {
            let productList = document.getElementById("admin-product-list");
            productList.innerHTML = "";
            products.forEach((product, index) => {
                let li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    ${product.name} - Rp ${product.price.toLocaleString()} | Stok: ${product.stock}
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">🗑 Hapus</button>
                `;
                productList.appendChild(li);
            });
        })
        .catch(error => console.error("Gagal memuat data produk:", error));
}

function addProduct() {
    let name = document.getElementById("product-name").value;
    let price = document.getElementById("product-price").value;
    let stock = document.getElementById("product-stock").value;
    let image = document.getElementById("product-image").files[0];

    if (!name || !price || !stock || !image) {
        alert("Harap isi semua kolom dan pilih gambar!");
        return;
    }

    let formData = new FormData();
    formData.append("action", "add");
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("image", image);

    fetch("backend.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Produk berhasil ditambahkan!");
            location.reload();
        } else {
            alert("Gagal menambah produk: " + data.message);
        }
    })
    .catch(error => console.error("Gagal menambah produk:", error));
}

function deleteProduct(index) {
    fetch("backend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", index })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Produk berhasil dihapus!");
            location.reload();
        } else {
            alert("Gagal menghapus produk: " + data.message);
        }
    })
    .catch(error => console.error("Gagal menghapus produk:", error));
}
