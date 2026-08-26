// assets/js/home.js
import { db, collection, onSnapshot, doc, getDoc } from './firebase.js';

async function loadBanner() {
    const settingsRef = doc(db, "settings", "general");
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('banner-image').src = data.bannerImage || 'https://via.placeholder.com/1200x300';
        document.getElementById('banner-text').innerText = data.bannerText || 'বিশ্বস্ত মানের নিত্যপ্রয়োজনীয় পণ্য';
    }
}

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

onSnapshot(collection(db, "products"), (snapshot) => {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = '';
    snapshot.forEach((doc) => {
        const p = doc.data();
        const stockClass = p.stock === "Available" ? 'in-stock' : 'out-stock';
        
        // ✅ পূর্ণ কার্ড Details Page-এ যাবে, কিন্তু Add Button শুধু Cart-এ যোগ করবে
        container.innerHTML += `
            <div class="product-card" onclick="window.location.href='product-details.html?id=${doc.id}'">
                <span class="badge ${stockClass}">${p.stock}</span>
                <img src="${p.image}" class="p-img" alt="${p.name}">
                <div class="p-info">
                    <div class="p-name">${p.name}</div>
                    <div class="p-price">৳ ${p.price}</div>
                    <div class="p-category">${p.category}</div>
                </div>
                <button class="add-btn" onclick="addToCart(event, '${doc.id}')">+</button>
            </div>
        `;
    });
});

// ✅ Add to Cart logic
window.addToCart = (event, id) => {
    event.stopPropagation(); // পূর্ণ কার্ড ক্লিক বন্ধ করে
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(x => x.id === id);
    if(item) item.qty++;
    else cart.push({ id: id, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Smooth UI Feedback
    const btn = event.target;
    btn.style.transform = 'scale(1.3)';
    btn.style.background = 'var(--deep-green)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
        btn.style.background = 'var(--text-black)';
    }, 500);
    
    alert('Added to List!');
};

loadBanner();
