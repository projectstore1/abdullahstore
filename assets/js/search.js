import { db, collection, onSnapshot } from './firebase.js';

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    onSnapshot(collection(db, "products"), (snapshot) => {
        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const p = doc.data();
            if (p.name.toLowerCase().includes(query)) {
                productsContainer.innerHTML += `
                    <div class="product-card">
                        <span class="badge ${p.stock === "Available" ? 'in-stock' : 'out-stock'}">${p.stock}</span>
                        <img src="${p.image}" class="p-img">
                        <div class="p-info">
                            <div class="p-name">${p.name}</div>
                            <div class="p-price">৳ ${p.price}</div>
                        </div>
                        <div class="actions">
                            <button class="add-btn" onclick="addToCart('${doc.id}')">+</button>
                        </div>
                    </div>
                `;
            }
        });
    });
});