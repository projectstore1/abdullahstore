import { db, collection, onSnapshot } from './firebase.js';

const categoriesContainer = document.getElementById('categories-container');
const productsContainer = document.getElementById('products-container');
const cartCount = document.getElementById('cart-count');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Load Categories
onSnapshot(collection(db, "categories"), (snapshot) => {
    categoriesContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const cat = doc.data();
        categoriesContainer.innerHTML += `
            <div class="cat-card" onclick="location.href='category.html?id=${doc.id}'">
                <img src="${cat.image}" alt="${cat.name}">
                <h4>${cat.name}</h4>
            </div>
        `;
    });
});

// Load Products
onSnapshot(collection(db, "products"), (snapshot) => {
    productsContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const p = doc.data();
        const stockClass = p.stock === "Available" ? 'in-stock' : 'out-stock';
        
        productsContainer.innerHTML += `
            <div class="product-card">
                <span class="badge ${stockClass}">${p.stock}</span>
                <img src="${p.image}" class="p-img" alt="${p.name}">
                <div class="p-info">
                    <div class="p-name">${p.name}</div>
                    <div class="p-price">৳ ${p.price}</div>
                    <div style="font-size: 12px; color: #6B7280;">Unit: ${p.unit}</div>
                </div>
                <div class="actions">
                    <button class="add-btn" onclick="addToCart('${doc.id}')">+</button>
                    <a href="product-details.html?id=${doc.id}" class="view-btn">View</a>
                </div>
            </div>
        `;
    });
});

// Add to Cart
window.addToCart = (id) => {
    const item = cart.find(x => x.id === id);
    if(item) item.qty++;
    else cart.push({ id: id, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to list!');
};

function updateCartCount() {
    cartCount.textContent = cart.reduce((a, b) => a + b.qty, 0);
}