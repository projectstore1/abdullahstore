// admin/assests/js/orders.js
import { db, collection, getDocs, updateDoc, doc } from './firebase.js';

let currentFilter = 'Pending';

// Load Orders from Firebase
async function loadOrders() {
    const table = document.getElementById('orders-table');
    if (!table) return;

    const snap = await getDocs(collection(db, "orders"));
    
    table.innerHTML = '';
    
    snap.forEach(orderDoc => {
        const order = orderDoc.data();
        
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
                    <button class="btn btn-edit" onclick="updateOrderStatus('${orderDoc.id}', 'Processing')">Processing</button>
                    <button class="btn btn-primary" onclick="updateOrderStatus('${orderDoc.id}', 'Completed')">Completed</button>
                    <button class="btn btn-danger" onclick="updateOrderStatus('${orderDoc.id}', 'Cancelled')">Cancel</button>
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
