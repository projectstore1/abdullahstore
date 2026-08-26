// admin/assests/js/order-details.js
import { db, doc, getDoc } from './firebase.js';

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('id');

const docRef = doc(db, "orders", orderId);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    const order = docSnap.data();
    
    let itemsHtml = '';
    if (order.items && Array.isArray(order.items)) {
        itemsHtml = order.items.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #ddd; padding:10px 0;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
                    <div>
                        <strong>${item.name}</strong>
                        <div style="font-size:14px; color:#555;">${item.qty} x ৳ ${item.price}</div>
                    </div>
                </div>
                <div style="font-weight:bold;">৳ ${item.price * item.qty}</div>
            </div>
        `).join('');
    } else {
        itemsHtml = '<p style="text-align:center; color:red;">No items found in this order!</p>';
    }

    document.getElementById('order-details-container').innerHTML = `
        <div class="card">
            <h2>Customer Info</h2>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>
            <p><strong>Delivery Fee:</strong> ৳ ${order.deliveryFee}</p>
            <p><strong>Total:</strong> ৳ ${order.total}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            
            <h3 style="margin-top: 20px;">Items</h3>
            <div>
                ${itemsHtml}
            </div>
        </div>
    `;
}
