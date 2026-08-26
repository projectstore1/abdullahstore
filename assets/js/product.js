// assets/js/product.js
import { db, doc, getDoc } from './firebase.js';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const docRef = doc(db, "products", productId);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    const p = docSnap.data();
    const stockClass = p.stock === "Available" ? 'in-stock' : 'out-stock';
    
    document.getElementById('detail-container').innerHTML = `
        <!-- বড় Image (Full Width) -->
        <img src="${p.image}" class="detail-img" alt="${p.name}" style="width: 100%; height: auto; max-height: 700px; object-fit: contain; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); display: block; margin: 0 auto;">
        
        <div class="detail-info" style="margin-top: 30px;">
            <h1 style="font-size: 36px;">${p.name}</h1>
            <div class="detail-price">৳ ${p.price}</div>
            <span class="badge ${stockClass}">${p.stock}</span>
            <p style="margin: 15px 0; color: #555; font-size: 18px;">${p.description || 'High quality product.'}</p>
            
            <div class="unit-selection">
                <h3>Select Unit</h3>
                <button class="unit-btn active" onclick="selectUnit(this, '1 ${p.unit}')">1 ${p.unit}</button>
                <button class="unit-btn" onclick="selectUnit(this, '2 ${p.unit}')">2 ${p.unit}</button>
                <button class="unit-btn" onclick="selectUnit(this, '5 ${p.unit}')">5 ${p.unit}</button>
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
let selectedUnit = '1 kg';

window.selectUnit = (btn, unit) => {
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedUnit = unit;
};

window.updateQty = (change) => {
    qty += change;
    if(qty < 1) qty = 1;
    document.getElementById('qty').innerText = qty;
};

window.addToList = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(x => x.id === productId);
    if(item) item.qty += qty;
    else cart.push({ id: productId, qty: qty, unit: selectedUnit });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to List!');
};

window.buyNow = () => {
    localStorage.setItem('single_product', JSON.stringify({ id: productId, qty: qty, unit: selectedUnit }));
    window.location.href = 'checkout.html';
};
