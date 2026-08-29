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
            <div class="item-row">
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="${item.image}" class="item-img" alt="${item.name}">
                    <div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-qty">${item.qty} x ৳ ${item.price}</div>
                    </div>
                </div>
                <div class="item-price">৳ ${item.price * item.qty}</div>
            </div>
        `).join('');
    } else {
        itemsHtml = '<p style="text-align:center; color:red; font-size:18px;">No items found in this order!</p>';
    }

    // Location Check করা
    let locationHtml = '';
    if (order.location) {
        locationHtml = `
            <div class="info-item">
                <p>Location</p>
                <strong>${order.location}</strong>
                <br><br>
                <a href="${order.location}" target="_blank" class="location-btn">📍 Open Location</a>
            </div>
        `;
    } else {
        locationHtml = `
            <div class="info-item">
                <p>Location</p>
                <strong style="color:red;">No Location Found</strong>
            </div>
        `;
    }

    document.getElementById('order-details-container').innerHTML = `
        <div class="card">
            <h2>Customer Info</h2>
            <div class="customer-info">
                <div class="info-item">
                    <p>Name</p>
                    <strong>${order.customerName}</strong>
                </div>
                <div class="info-item">
                    <p>Phone</p>
                    <strong>${order.phone}</strong>
                </div>
                <div class="info-item">
                    <p>Address</p>
                    <strong>${order.address}</strong>
                </div>
                <div class="info-item">
                    <p>Payment</p>
                    <strong>${order.paymentMethod}</strong>
                </div>
                <div class="info-item">
                    <p>Delivery Fee</p>
                    <strong>৳ ${order.deliveryFee}</strong>
                </div>
                <div class="info-item">
                    <p>Status</p>
                    <strong>${order.status}</strong>
                </div>
                ${locationHtml}
            </div>
        </div>
        
        <div class="card">
            <h2>Items</h2>
            <div class="items-table">
                ${itemsHtml}
            </div>
            <div class="summary">
                <div class="summary-item">
                    <p>Total</p>
                    <strong>৳ ${order.total}</strong>
                </div>
            </div>
        </div>
    `;
}
