import { db, doc, getDoc } from './firebase.js';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const container = document.getElementById('detail-container');

const docRef = doc(db, "products", productId);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    const p = docSnap.data();
    const stockClass = p.stock === "Available" ? 'in-stock' : 'out-stock';
    
    container.innerHTML = `
        <img src="${p.image}" class="detail-img" alt="${p.name}">
        <div class="detail-info">
            <h1>${p.name}</h1>
            <div class="detail-price">৳ ${p.price}</div>
            <span class="badge ${stockClass}">${p.stock}</span>
            <p style="margin: 15px 0; color: #6B7280;">Description: ${p.description || 'High quality product.'}</p>
            
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
    document.getElementById('qty').textContent = qty;
};

window.addToList = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(x => x.id === productId);
    if(item) item.qty += qty;
    else cart.push({ id: productId, qty: qty, unit: selectedUnit });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to list!');
};

window.buyNow = () => {
    localStorage.setItem('single_product', JSON.stringify({ id: productId, qty: qty, unit: selectedUnit }));
    window.location.href = 'checkout.html';
};