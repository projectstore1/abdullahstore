import { db, collection, getDocs } from './firebase.js';

async function loadDashboard() {
    // Load Products
    const prodSnap = await getDocs(collection(db, "products"));
    document.getElementById('total-products').innerText = prodSnap.size;

    // Load Categories
    const catSnap = await getDocs(collection(db, "categories"));
    document.getElementById('total-categories').innerText = catSnap.size;

    // Load Orders
    const orderSnap = await getDocs(collection(db, "orders"));
    let pending = 0, completed = 0;
    const tableBody = document.querySelector('#recent-orders-table tbody');
    tableBody.innerHTML = '';

    orderSnap.forEach(doc => {
        const order = doc.data();
        if(order.status === 'Pending') pending++;
        if(order.status === 'Completed') completed++;

        const statusClass = order.status === 'Pending' ? 'status-pending' : 
                            order.status === 'Processing' ? 'status-processing' : 
                            order.status === 'Completed' ? 'status-completed' : 'status-cancelled';

        tableBody.innerHTML += `
            <tr>
                <td>${order.customerName}</td>
                <td>৳ ${order.total}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>${order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
            </tr>
        `;
    });

    document.getElementById('pending-orders').innerText = pending;
    document.getElementById('completed-orders').innerText = completed;
}

loadDashboard();