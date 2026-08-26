// assets/js/home.js
import { db, collection, onSnapshot, doc, getDoc } from './firebase.js';

// সব প্রোডাক্ট সংরক্ষণের জন্য ভেরিয়েবল
let allProducts = [];

async function loadBanner() {
    const settingsRef = doc(db, "settings", "general");
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('banner-image').src = data.bannerImage || 'https://via.placeholder.com/1200x300';
        document.getElementById('banner-text').innerText = data.bannerText || 'বিশ্বস্ত মানের নিত্যপ্রয়োজনীয় পণ্য';
    }
}

// Categories লোড করা
onSnapshot(collection(db, "categories"), (snapshot) => {
    const container = document.getElementById('categories-container');
    if (!container) return;
    container.innerHTML = '';
    snapshot.forEach((doc) => {
        const cat = doc.data();
        container.innerHTML += `
            <div class="cat-card" onclick="location.href='category.html?id=${doc.id}'">
                <img src="${cat.image}" alt="${cat.name}">
                <h4>${cat.name}</h4>
            </div>
        `;
    });
});

// Products লোড করা
onSnapshot(collection(db, "products"), (snapshot) => {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    allProducts = []; // রিসেট
    container.innerHTML = '';
    
    snapshot.forEach((doc) => {
        const p = doc.data();
        allProducts.push({ id: doc.id, ...p }); // সব প্রোডাক্ট স্টোর করা
        
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
    });
});

// 🔍 Search ফাংশন (HTML থেকে কল হবে)
window.searchProducts = function() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const container = document.getElementById('products-container');
    
    if (!container) return;
    
    // সার্চ টেক্সট দিয়ে ফিল্টার করা
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchText) || 
        product.category.toLowerCase().includes(searchText)
    );
    
    container.innerHTML = '';
    
    filteredProducts.forEach((p) => {
        const stockClass = p.stock === "Available" ? 'in-stock' : 'out-stock';
        
        container.innerHTML += `
            <div class="product-card" onclick="window.location.href='product-details.html?id=${p.id}'">
                <span class="badge ${stockClass}">${p.stock}</span>
                <img src="${p.image}" class="p-img" alt="${p.name}">
                <div class="p-info">
                    <div class="p-name">${p.name}</div>
                    <div class="p-price">৳ ${p.price}</div>
                    <div class="p-category">${p.category}</div>
                </div>
            </div>
        `;
    });
    
    // যদি কিছু না পাওয়া যায়
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#555;">কোনো পণ্য পাওয়া যায়নি!</p>';
    }
};

loadBanner();
