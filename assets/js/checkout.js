// assets/js/checkout.js
import { db, doc, getDoc, collection, addDoc } from './firebase.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let singleProduct = JSON.parse(localStorage.getItem('single_product'));
let selectedPayment = 'cash';
let deliveryFee = 30;

async function calculateTotal() {
    let total = 0;
    
    if (singleProduct) {
        cart = [singleProduct];
    }
    
    for (let item of cart) {
        const docRef = doc(db, "products", item.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            total += docSnap.data().price * item.qty;
        }
    }
    total += deliveryFee;
    document.getElementById('total').innerText = '৳ ' + total;
}

calculateTotal();

window.selectPayment = (method) => {
    selectedPayment = method;
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
    document.getElementById(`pay-${method}`).classList.add('selected');
};

window.placeOrder = async () => {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;

    if (!name || !phone || !address) {
        alert('Please fill all fields!');
        return;
    }

    try {
        await addDoc(collection(db, "orders"), {
            customerName: name,
            phone: phone,
            address: address,
            paymentMethod: selectedPayment === 'bkash' ? 'Bkash QR' : 'Cash',
            deliveryFee: deliveryFee,
            total: calculateTotal(),
            items: cart,
            status: "Pending"
        });
        localStorage.removeItem('cart');
        localStorage.removeItem('single_product');
        window.location.href = 'thanks.html';
    } catch (error) {
        alert('Error placing order: ' + error.message);
    }
};
