import { db, collection, addDoc } from './firebase.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let singleProduct = JSON.parse(localStorage.getItem('single_product'));
let selectedPayment = 'cash';
let deliveryFee = 30;
let total = 0;

// If single product, show only that
if (singleProduct) {
    cart = [singleProduct];
    document.getElementById('order-summary').innerHTML = '<p>Single Product Order</p>';
}

// Calculate total
async function calculateTotal() {
    for (let item of cart) {
        const docRef = doc(db, "products", item.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            total += docSnap.data().price * item.qty;
        }
    }
    total += deliveryFee;
    document.getElementById('subtotal').textContent = '৳ ' + (total - deliveryFee);
    document.getElementById('delivery-fee').textContent = '৳ ' + deliveryFee;
    document.getElementById('total').textContent = '৳ ' + total;
}

calculateTotal();

// Payment Selection
window.selectPayment = (method) => {
    selectedPayment = method;
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
    document.getElementById(`pay-${method}`).classList.add('selected');
};

// Place Order
window.placeOrder = async () => {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;

    if (!name || !phone || !address) {
        alert('Please fill all fields!');
        return;
    }

    const order = {
        customerName: name,
        phone: phone,
        address: address,
        paymentMethod: selectedPayment === 'bkash' ? 'Bkash QR' : 'Cash',
        deliveryFee: deliveryFee,
        total: total,
        items: cart,
        status: "Pending"
    };

    await addDoc(collection(db, "orders"), order);
    localStorage.removeItem('cart');
    localStorage.removeItem('single_product');
    window.location.href = 'thanks.html';
};