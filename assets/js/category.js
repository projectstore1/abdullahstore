// assets/js/category.js
import { db, doc, getDoc, collection, onSnapshot } from './firebase.js';

const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('id');

async function loadCategoryTitle() {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        document.getElementById('category-title').innerText = docSnap.data().name;
    }
}

onSnapshot(collection(db, "products"), (snapshot) => {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = '';
    snapshot.forEach((doc) => {
        const p = doc.data();
        if (p.category === docSnap.data().name) { // Compare by name
            const stockClass = p.stock === "Available" ? 'in-stock' : 'out-stock';
            container.innerHTML += `
                <div class="product-card">
                    <span class="badge ${stockClass}">${p.stock}</span>
                    <img src="${p.image}" class="p-img" alt="${p.name}">
                    <div class="p-info">
                        <div class="p-name">${p.name}</div>
                        <div class="p-price">৳ ${p.price}</div>
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

loadCategoryTitle();
