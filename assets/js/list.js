// assets/js/list.js
import { db, doc, getDoc } from './firebase.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = 0;

async function loadCart() {
    const container = document.getElementById('list-container');
    if (!container) return;
    
    total = 0; // Total Reset করছি
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#6B7280;">Your list is empty!</p>';
        return;
    }

    for (let item of cart) {
        const docRef = doc(db, "products", item.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const p = docSnap.data();
            const subtotal = p.price * item.qty;
            total += subtotal; // সঠিকভাবে যোগ হবে

            container.innerHTML += `
                <div class="list-card">
                    <img src="${p.image}" style="width:80px; height:80px; border-radius:10px; object-fit:cover;">
                    <div style="flex:1; margin-left:15px;">
                        <strong style="font-size:20px;">${p.name}</strong>
                        <div style="font-size:16px; color:#6B7280;">${p.unit}</div>
                    </div>
                    <div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                            <span style="font-size:22px; font-weight:bold;">${item.qty}</span>
                            <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                        </div>
                        <div style="color:var(--secondary); font-weight:900; font-size:20px; margin-top:10px;">৳ ${subtotal}</div>
                    </div>
                    <div style="margin-left:15px;">
                        <button class="delete-btn" onclick="deleteItem('${item.id}')">Delete</button>
                    </div>
                </div>
            `;
        }
    }
    document.getElementById('total-price').innerText = total;
}

// ✅ বড় + / - বাটন
window.updateQty = (id, change) => {
    const idx = cart.findIndex(x => x.id === id);
    if(idx > -1) {
        cart[idx].qty += change;
        if(cart[idx].qty <= 0) cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
};

// ✅ Delete বাটন
window.deleteItem = (id) => {
    if(confirm('Are you sure you want to delete this item?')) {
        cart = cart.filter(x => x.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
};

loadCart();
