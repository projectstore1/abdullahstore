import { db, doc, getDoc } from './firebase.js';

const container = document.getElementById('list-container');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = 0;

async function loadCart() {
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
            total += subtotal;

            container.innerHTML += `
                <div class="list-card">
                    <img src="${p.image}" style="width:60px; height:60px; border-radius:10px; object-fit:cover;">
                    <div style="flex:1; margin-left:15px;">
                        <strong>${p.name}</strong>
                        <div style="font-size:14px; color:#6B7280;">${p.unit}</div>
                    </div>
                    <div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <button onclick="updateQty('${item.id}', -1)">-</button>
                            <span>${item.qty}</span>
                            <button onclick="updateQty('${item.id}', 1)">+</button>
                        </div>
                        <div style="color: var(--secondary); font-weight:bold; margin-top:5px;">৳ ${subtotal}</div>
                    </div>
                </div>
            `;
        }
    }
    document.getElementById('total-price').textContent = total;
}

window.updateQty = (id, change) => {
    const idx = cart.findIndex(x => x.id === id);
    if(idx > -1) {
        cart[idx].qty += change;
        if(cart[idx].qty <= 0) cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
};

loadCart();