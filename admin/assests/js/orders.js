// admin/assests/js/orders.js
import { db, collection, getDocs, updateDoc, doc } from './firebase.js';

// 👇 এখানে আপনার Google Apps Script URL দিন (শুধু URL)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwL6TW7yQFU1VU_A-2qZoSKAPcs6HseyX3AawUxw_VQSpJdOJADobVyzd2fWZH2H80z/exec';

let currentFilter = 'Pending';

// ✅ নতুন অর্ডার এলে শুধু "New Order" এবং "Order Page Link" পাঠাবে
async function sendOrderEmail(orderId) {
    try {
        // অর্ডার পেজের লিংক (Admin Panel-এ)
        const orderLink = `${window.location.origin}/admin/order-details.html?id=${orderId}`;
        
        await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderLink: orderLink
            })
        });
        console.log('✅ Email sent successfully.');
    } catch (error) {
        console.error('❌ Email not sent:', error);
    }
}

async function loadOrders() {
    const table = document.getElementById('orders-table');
    if (!table) return;

    const snap = await getDocs(collection(db, "orders"));
    
    table.innerHTML = '';
    
    snap.forEach(orderDoc => {
        const order = orderDoc.data();
        
        // ✅ নতুন Pending অর্ডার দেখলেই ইমেইল পাঠাবে (একবারই)
        if (order.status === 'Pending' && !order.emailSent) {
            sendOrderEmail(orderDoc.id);
            // ইমেইল পাঠানো হয়েছে কিনা মার্ক করে রাখা (Firestore-এ)
            updateDoc(doc(db, "orders", orderDoc.id), { emailSent: true });
        }
        
        if(currentFilter !== 'All' && order.status !== currentFilter) return;

        const statusClass = order.status === 'Pending' ? 'status-pending' : 
                            order.status === 'Processing' ? 'status-processing' : 
                            order.status === 'Completed' ? 'status-completed' : 'status-cancelled';

        table.innerHTML += `
            <tr>
                <td>${order.customerName}</td>
                <td>${order.phone}</td>
                <td>${order.address}</td>
                <td>৳ ${order.total}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>
                    <a href="order-details.html?id=${orderDoc.id}" class="btn btn-edit">See Details</a>
                    <button class="btn btn-primary" onclick="updateOrderStatus('${orderDoc.id}', 'Processing')">Processing</button>
                    <button class="btn btn-edit" onclick="updateOrderStatus('${orderDoc.id}', 'Confirm')">Confirm</button>
                    <button class="btn btn-danger" onclick="updateOrderStatus('${orderDoc.id}', 'Cancel')">Cancel</button>
                </td>
            </tr>
        `;
    });
}

window.filterOrders = (status) => {
    currentFilter = status;
    loadOrders();
};

window.updateOrderStatus = async (id, newStatus) => {
    if(confirm(`Are you sure you want to change status to ${newStatus}?`)) {
        await updateDoc(doc(db, "orders", id), {
            status: newStatus
        });
        loadOrders();
    }
};

loadOrders();
