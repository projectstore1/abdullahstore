import { db, collection, onSnapshot, getDoc, doc } from './firebase.js';

const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('id');
const categoryTitle = document.getElementById('category-title');
const productsContainer = document.getElementById('products-container');

// Load Category Name
const catDoc = await getDoc(doc(db, "categories", categoryId));
if (catDoc.exists()) {
    categoryTitle.textContent = catDoc.data().name;
}

// Load Products by Category
onSnapshot(collection(db, "products"), (snapshot) => {
    productsContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const p = doc.data();
        if (p.category === catDoc.data().name) {
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
        }
    });
});

window.addToCart = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(x => x.id === id);
    if(item) item.qty++;
    else cart.push({ id: id, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added!');
};