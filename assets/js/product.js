// assets/js/product.js
import { db, doc, getDoc } from './firebase.js';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const docRef = doc(db, "products", productId);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    const p = docSnap.data();
    const stockClass = p.stock === "Available" ? 'in-stock' : 'out-stock';
    const basePrice = p.unitPrices ? p.unitPrices[1] : p.price; // যদি unitPrices না থাকে, base price নিবে
    
    document.getElementById('detail-container').innerHTML = `
        <img src="${p.image}" class="detail-img" alt="${p.name}" style="width: 100%; height: 450px; object-fit: cover; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        
        <div class="detail-info" style="margin-top: 30px;">
            <h1 style="font-size: 36px;">${p.name}</h1>
            
            <div class="detail-price" id="detail-price" style="font-size: 32px; color: var(--deep-orange); font-weight: 900; margin: 15px 0;">
                ৳ ${basePrice}
            </div>
            
            <span class="badge ${stockClass}">${p.stock}</span>
            <p style="margin: 15px 0; color: #555; font-size: 18px;">${p.description || 'High quality product.'}</p>
            
            <div class="unit-selection">
                <h3>Select Unit</h3>
                ${p.unitOptions && p.unitPrices ? p.unitOptions.map(unit => `
                    <button class="unit-btn ${unit === 1 ? 'active' : ''}" onclick="selectUnit(this, '${unit}', ${p.unitPrices[unit]})">
                        ${unit} ${p.unit}
                    </button>
                `).join('') : `
                    <button class="unit-btn active" onclick="selectUnit(this, '1', ${basePrice})">1 ${p.unit}</button>
                `}
            </div>
            
            <div class="qty-selector">
                <button class="qty-btn" onclick="updateQty(-1)">-</button>
                <span id="qty" style="font-size: 24px; font-weight: 700;">1</span>
                <button class="qty-btn" onclick="updateQty(1)">+</button>
            </div>
            
            <button class="btn-primary" onclick="addToList()">Add To List</button>
            <button class="btn-secondary" onclick="buyNow()">Buy Now</button>
        </div>
    `;
}

let qty = 1;
let selectedUnit = '1';
let selectedUnitPrice = 0;

// Unit Select করার ফাংশন
window.selectUnit = (btn, unit, price) => {
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    selectedUnit = unit;
    selectedUnitPrice = price;
    
    // দাম আপডেট করা (এখনো quantity 1 আছে)
    document.getElementById('qty').innerText = '1';
    qty = 1;
    document.getElementById('detail-price').innerText = '৳ ' + (price * qty);
};

// Quantity আপডেট করার ফাংশন
window.updateQty = (change) => {
    qty += change;
    if(qty < 1) qty = 1;
    document.getElementById('qty').innerText = qty;
    
    // দাম আপডেট করা (Price * Quantity)
    if (selectedUnitPrice > 0) {
        document.getElementById('detail-price').innerText = '৳ ' + (selectedUnitPrice * qty);
    }
};

window.addToList = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(x => x.id === productId);
    
    if(item) {
        item.qty += qty;
        item.unit = selectedUnit;
        item.price = selectedUnitPrice;
    } else {
        cart.push({ id: productId, qty: qty, unit: selectedUnit, price: selectedUnitPrice });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to List!');
};

window.buyNow = () => {
    localStorage.setItem('single_product', JSON.stringify({ id: productId, qty: qty, unit: selectedUnit, price: selectedUnitPrice }));
    window.location.href = 'checkout.html';
};
