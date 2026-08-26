// assets/js/checkout.js
import { db, doc, getDoc, collection, addDoc } from './firebase.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let singleProduct = JSON.parse(localStorage.getItem('single_product'));
let selectedPayment = 'cash';
let deliveryFee = 30;

if (singleProduct) {
    cart = [singleProduct];
}

async function loadDeliveryFee() {
    const settingsRef = doc(db, "settings", "general");
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        deliveryFee = data.deliveryFee || 30;
        document.getElementById('delivery-fee').innerText = '৳ ' + deliveryFee;
    }
}

async function loadOrderSummary() {
    const container = document.getElementById('order-items');
    let subtotal = 0;
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#555;">আপনার কার্ট খালি!</p>';
        return;
    }

    for (let item of cart) {
        const docRef = doc(db, "products", item.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const p = docSnap.data();
            const price = item.price || p.unitPrices[1]; // Unit Price
            const subtotalItem = price * item.qty;
            subtotal += subtotalItem;
            
            container.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
                        <div>
                            <strong style="color:#111;">${p.name}</strong>
                            <div style="font-size:14px; color:#555;">${item.qty} x ৳ ${price} (${item.unit || '1'} ${p.unit})</div>
                        </div>
                    </div>
                    <div style="font-weight:bold; color:#111;">৳ ${subtotalItem}</div>
                </div>
            `;
        }
    }
    
    document.getElementById('subtotal').innerText = '৳ ' + subtotal;
    document.getElementById('total').innerText = '৳ ' + (subtotal + deliveryFee);
}

window.selectPayment = (method) => {
    selectedPayment = method;
    document.getElementById('pay-cash').classList.remove('selected');
    document.getElementById('pay-bkash').classList.remove('selected');
    if (method === 'cash') {
        document.getElementById('pay-cash').classList.add('selected');
    } else {
        document.getElementById('pay-bkash').classList.add('selected');
    }
};

window.placeOrder = async () => {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;

    if (!name || !phone || !address) {
        alert('সব তথ্য পূরণ করুন!');
        return;
    }

    let subtotal = 0;
    let orderItems = [];
    
    for (let item of cart) {
        const docRef = doc(db, "products", item.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const p = docSnap.data();
            const price = item.price || p.unitPrices[1];
            subtotal += price * item.qty;
            
            orderItems.push({
                productId: item.id,
                name: p.name,
                price: price,
                qty: item.qty,
                unit: item.unit || '1',
                image: p.image
            });
        }
    }
    const total = subtotal + deliveryFee;

    try {
        await addDoc(collection(db, "orders"), {
            customerName: name,
            phone: phone,
            address: address,
            paymentMethod: selectedPayment === 'bkash' ? 'Bangla QR Pay' : 'Cash Payment',
            deliveryFee: deliveryFee,
            total: total,
            items: orderItems,
            status: "Pending"
        });
        
        localStorage.removeItem('cart');
        localStorage.removeItem('single_product');
        
        window.location.href = 'thanks.html';
    } catch (error) {
        alert('Error placing order: ' + error.message);
    }
};

loadDeliveryFee();
loadOrderSummary();
