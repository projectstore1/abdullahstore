async function loadOrderDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const order = docSnap.data();
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
                <ul>
                    ${order.items.map(item => `<li>Product ID: ${item.id} (Qty: ${item.qty})</li>`).join('')}
                </ul>
            </div>
        `;
    }
}

if(document.getElementById('order-details-container')) {
    loadOrderDetails();
}