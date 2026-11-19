const featuresButton = document.querySelector("#featuresButton");
const featuresSection = document.querySelector("#features");

const productForm = document.querySelector("#productForm");
const productList = document.querySelector("#productList");
const orderList = document.querySelector("#orderList");

let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

featuresButton.addEventListener("click", () => {
    featuresSection.scrollIntoView({
        behavior: "smooth"
    });
});

// Відображення товарів
function renderProducts() {
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = "<p>Каталог поки порожній.</p>";
        return;
    }

    products.forEach((product, index) => {
        const item = document.createElement("div");
        item.className = "product-card";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = `Ціна: ${product.price} грн`;

        const quantity = document.createElement("p");
        quantity.textContent = `Кількість: ${product.quantity}`;

        const orderButton = document.createElement("button");
        orderButton.textContent = "Замовити";
        orderButton.addEventListener("click", () => createOrder(index));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Видалити";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => deleteProduct(index));

        item.append(name, price, quantity, orderButton, deleteButton);
        productList.appendChild(item);
    });
}

// Додавання товару
productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#productName").value.trim();
    const price = Number(document.querySelector("#productPrice").value);
    const quantity = Number(document.querySelector("#productQuantity").value);

    if (!name || !Number.isFinite(price) || price <= 0 ||
        !Number.isInteger(quantity) || quantity <= 0) {
        alert("Перевірте правильність введених даних.");
        return;
    }

    products.push({
        name: name,
        price: price,
        quantity: quantity
    });

    saveProducts();
    productForm.reset();
    renderProducts();
});

// Видалення товару
function deleteProduct(index) {
    products.splice(index, 1);

    saveProducts();
    renderProducts();
}

// Створення замовлення
function createOrder(index) {
    const product = products[index];

    if (product.quantity <= 0) {
        alert("Товару немає в наявності.");
        return;
    }

    product.quantity--;

    const order = {
        productName: product.name,
        price: product.price,
        status: "Нове",
        date: new Date().toLocaleString("uk-UA")
    };

    orders.push(order);

    saveProducts();
    saveOrders();

    renderProducts();
    renderOrders();
}

// Збереження товарів
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

// Збереження замовлень
function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// Відображення замовлень
function renderOrders() {
    orderList.innerHTML = "";

    if (orders.length === 0) {
        orderList.innerHTML = "<p>Замовлень поки немає.</p>";
        return;
    }

    orders.forEach((order, index) => {
        const item = document.createElement("div");
        item.className = "order-card";

        const title = document.createElement("h3");
        title.textContent = `Замовлення №${index + 1}`;

        const product = document.createElement("p");
        product.textContent = `Товар: ${order.productName}`;

        const price = document.createElement("p");
        price.textContent = `Сума: ${order.price} грн`;

        const status = document.createElement("p");
        status.textContent = `Статус: ${order.status}`;

        const date = document.createElement("p");
        date.textContent = `Дата: ${order.date}`;

        item.append(title, product, price, status, date);
        orderList.appendChild(item);
    });
}

// Початкове завантаження
renderProducts();
renderOrders();