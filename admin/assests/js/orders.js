// admin/assests/js/orders.js
import { db, collection, getDocs, updateDoc, doc } from './firebase.js';

// ✅ এখানে আপনার Google Apps Script URL দিন
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzpiBT6c0sK1mmf_AhBkS_XH9-TIrCZVLxDKEgDhmddJg6tbwOH4dEdm_oh1YWZ6D1p/exec';

let currentFilter = 'Pending';

// ✅ নতুন অর্ডার পেলে ইমেইল পাঠানোর ফাংশন
async function sendOrderEmail(order) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        paymentMethod: order.paymentMethod,
        total: order.total,
        deliveryFee: order.deliveryFee,
        items: order.items
      })
    });
    const result = await response.json();
    if (result.status === 'success') {
      console.log('✅ Email sent successfully.');
    } else {
      console.error('❌ Failed to send email:', result.message);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function loadOrders() {
    const table = document.getElementById('orders-table');
    if (!table) return;

    const snap = await getDocs(collection(db, "orders"));
    
    table.innerHTML = '';
    
    snap.forEach(orderDoc => {
        const order = orderDoc.data();
        
        // ✅ নতুন Pending অর্ডার পেলে Email পাঠানো হবে (একবারই)
        if (order.status === 'Pending' && !order.emailSent) {
            sendOrderEmail(order);
            // ইমেইল পাঠানো হয়েছে মার্ক করা
            updateDoc(doc(db, "orders", orderDoc.id), { emailSent: true });
        }
        
        if(currentFilter !== 'All' && order.status !== currentFilter) return;

        const statusClass = order.status === 'Pending' ? 'status-pending' : 
                            order.status === 'Processing' ? 'status-processing' : 
                            order.status === 'Completed' ? 'status-completed' : 'status-cancelled';

        table.innerHTML += 
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
        ;
    });
}

window.filterOrders = (status) => {
    currentFilter = status;
    loadOrders();
};

window.updateOrderStatus = async (id, newStatus) => {
    if(confirm(Are you sure you want to change status to ${newStatus}?)) {
        await updateDoc(doc(db, "orders", id), {
            status: newStatus
        });
        loadOrders();
    }
};

loadOrders();
