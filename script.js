let products = [
    { name: "Risol", price: 2000, image: "risol.jpg" },
    { name: "Bakwan", price: 1000, image: "bakwan.jpg" },
    { name: "Bolu", price: 5000, image: "bolu.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayProducts() {
    let productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach((product, index) => {
        productList.innerHTML += `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
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
        cart.push({ name: product.name, quantity: parseInt(quantity), image: product.image });
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
        cartItems.innerHTML += `
            <li>
                <img src="${item.image}" width="40">
                ${item.name} (${item.quantity})
                <button onclick="changeQuantity(${index}, -1)">➖</button>
                <button onclick="changeQuantity(${index}, 1)">➕</button>
                <button onclick="removeFromCart(${index})">❌</button>
            </li>
        `;
    });
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function checkout() {
    let name = document.getElementById("customer-name").value;
    let time = document.getElementById("pickup-time").value;
    let delivery = document.getElementById("delivery-option").value;
    let address = document.getElementById("customer-address").value;
    let maps = document.getElementById("maps-link").value;

    let message = `Assalamualaikum\nSaya mau pesan:\n`;
    cart.forEach(item => message += `- ${item.name} ${item.quantity}\n`);
    message += `\n${delivery === "diantar" ? `Diantar ke: ${address} (${maps})` : "Diambil"} jam ${time}\nAtas nama: ${name}`;

    window.open(`https://wa.me/082111039958?text=${encodeURIComponent(message)}`);
}

document.addEventListener("DOMContentLoaded", () => {
    displayProducts();
    updateCartCount();
    renderCart();
});
