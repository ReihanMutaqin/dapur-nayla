let products = [
    { name: "Risol", price: 2000 },
    { name: "Bakwan", price: 1000 },
    { name: "Bolu", price: 5000 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayProducts() {
    let productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach((product, index) => {
        productList.innerHTML += `
            <div class="product">
                <h3>${product.name}</h3>
                <p>Rp ${product.price}</p>
                <input type="number" id="qty-${index}" value="1" min="1">
                <button onclick="addToCart(${index})">Tambah</button>
            </div>
        `;
    });
}

function addToCart(index) {
    let quantity = document.getElementById(`qty-${index}`).value;
    let product = products[index];

    let existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.push({ name: product.name, quantity: parseInt(quantity) });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    document.getElementById("cart-count").innerText = cart.reduce((total, item) => total + item.quantity, 0);
}

function renderCart() {
    let cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${item.name} (${item.quantity}) 
            <button onclick="removeFromCart(${index})">Hapus</button>`;
        cartItems.appendChild(li);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function toggleCart() {
    let cartDiv = document.getElementById("cart");
    cartDiv.style.display = (cartDiv.style.display === "block") ? "none" : "block";
}

function checkout() {
    let message = "Assalamualaikum\nSaya mau pesan\n";
    cart.forEach(item => {
        message += `- ${item.name} ${item.quantity}\n`;
    });
    message += "\nDiambil jam / Diantar jam\nKe alamat + Google Maps (jika memilih opsi diantar)\nAtas nama: ";

    let whatsappUrl = `https://wa.me/082111039958?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
    updateCartCount();
    renderCart();
});
