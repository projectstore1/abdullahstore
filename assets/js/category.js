// assets/js/category.js
import { db, doc, getDoc, collection, onSnapshot } from './firebase.js';

const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('id');

async function loadCategoryTitle() {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // Category Name টা Title এ দেখানো হবে
        document.getElementById('category-title').innerText = docSnap.data().name;
    }
}

onSnapshot(collection(db, "products"), (snapshot) => {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = '';
    
    snapshot.forEach((doc) => {
        const p = doc.data();
        
        // ✅ সঠিক ফিল্টার: Admin Panel থেকে দেওয়া Category Name এর সাথে মিলছে কিনা চেক করা
        if (p.category === categoryName) { 
            const stockClass = p.stock === "Available" ? 'in-stock' : 'out-stock';
            
            container.innerHTML += `
                <div class="product-card" onclick="window.location.href='product-details.html?id=${doc.id}'">
                    <span class="badge ${stockClass}">${p.stock}</span>
                    <img src="${p.image}" class="p-img" alt="${p.name}">
                    <div class="p-info">
                        <div class="p-name">${p.name}</div>
                        <div class="p-price">৳ ${p.price}</div>
                        <div class="p-category">${p.category}</div>
                    </div>
                </div>
            `;
        }
    });
});

// Category Name টা ডকুমেন্ট থেকে লোড করা হবে, তারপর Products ফিল্টার করা হবে
let categoryName = '';
async function loadCategoryProducts() {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        categoryName = docSnap.data().name;
        // Category Name পাওয়ার পর products onSnapshot টা কাজ করবে
        onSnapshot(collection(db, "products"), (snapshot) => {
            const container = document.getElementById('products-container');
            if (!container) return;
            container.innerHTML = '';
            
            snapshot.forEach((doc) => {
                const p = doc.data();
                if (p.category === categoryName) {
                    const stockClass = p.stock === "Available" ? 'in-stock' : 'out-stock';
                    
                    container.innerHTML += `
                        <div class="product-card" onclick="window.location.href='product-details.html?id=${doc.id}'">
                            <span class="badge ${stockClass}">${p.stock}</span>
                            <img src="${p.image}" class="p-img" alt="${p.name}">
                            <div class="p-info">
                                <div class="p-name">${p.name}</div>
                                <div class="p-price">৳ ${p.price}</div>
                                <div class="p-category">${p.category}</div>
                            </div>
                        </div>
                    `;
                }
            });
        });
    }
}

loadCategoryTitle();
loadCategoryProducts();
