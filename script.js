document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    updateCartCount();
    renderCart();
    setupDeliveryOption();
});

function loadProducts() {
    fetch("data.json")
        .then(response => response.json())
        .then(products => {
            let productList = document.getElementById("product-list");
            productList.innerHTML = "";
            products.forEach(product => {
                let productCard = document.createElement("div");
                productCard.className = "col-md-4 mb-3";
                productCard.innerHTML = `
                    <div class="card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">Rp ${product.price.toLocaleString()} | Stok: ${product.stock}</p>
                            <button class="btn btn-primary" onclick="addToCart('${product.id}', '${product.name}', ${product.price}')" ${product.stock <= 0 ? "disabled" : ""}>Tambah</button>
                        </div>
                    </div>
                `;
                productList.appendChild(productCard);
            });
        })
        .catch(error => console.error("Gagal memuat data produk:", error));
}

function addToCart(id, name, price) {
    fetch("backend.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reduceStock", id })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            alert("Stok habis!");
            return;
        }
        loadProducts(); 
    });
}
