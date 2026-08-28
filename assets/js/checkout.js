// assets/js/checkout.js
import { db, doc, getDoc, collection, addDoc } from './firebase.js';

// 👇 এখানে আপনার Google Apps Script URL দিন
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzpiBT6c0sK1mmf_AhBkS_XH9-TIrCZVLxDKEgDhmddJg6tbwOH4dEdm_oh1YWZ6D1p/exec';

// Cart বা Single Product থেকে ডাটা নেওয়া
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let singleProduct = JSON.parse(localStorage.getItem('single_product'));
let selectedPayment = 'cash';
let deliveryFee = 30;

// Single Product থাকলে সেটাকে Cart-এ কনভার্ট করা
if (singleProduct) {
    cart = [singleProduct];
}

// Settings থেকে Delivery Fee লোড করা
async function loadDeliveryFee() {
    const settingsRef = doc(db, "settings", "general");
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        deliveryFee = data.deliveryFee || 30;
        document.getElementById('delivery-fee').innerText = '৳ ' + deliveryFee;
    }
}

// Order Summary-এ Products List দেখানো
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
            const subtotalItem = p.price * item.qty;
            subtotal += subtotalItem;
            
            container.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
                        <div>
                            <strong style="color:#111;">${p.name}</strong>
                            <div style="font-size:14px; color:#555;">${item.qty} x ৳ ${p.price}</div>
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

// Payment Method Select
window.selectPayment = (method) => {
    selectedPayment = method;
    
    document.getElementById('pay-cash').classList.remove('selected');
    document.getElementById('pay-bkash').classList.remove('selected');
    
    // সিলেক্ট করা মেথডে Active Class যোগ
    if (method === 'cash') {
        document.getElementById('pay-cash').classList.add('selected');
    } else {
        document.getElementById('pay-bkash').classList.add('selected');
    }
};

// Order Place করার ফাংশন
window.placeOrder = async () => {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;

    if (!name || !phone || !address) {
        alert('সব তথ্য পূরণ করুন!');
        return;
    }

    // মোট হিসাব
    let subtotal = 0;
    for (let item of cart) {
        const docRef = doc(db, "products", item.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            subtotal += docSnap.data().price * item.qty;
        }
    }
    const total = subtotal + deliveryFee;

    // Items Array-এ প্রোডাক্টের সম্পূর্ণ তথ্য
    let orderItems = [];
    for (let item of cart) {
        const docRef = doc(db, "products", item.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const p = docSnap.data();
            orderItems.push({
                productId: item.id,
                name: p.name,
                price: p.price,
                qty: item.qty,
                image: p.image
            });
        }
    }

    try {
        // ✅ Firebase-এ অর্ডার সাবমিট করা
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

        // ✅ ইমেইল পাঠানোর জন্য form.submit() ব্যবহার করা (নতুন ট্যাব খুলবে, তারপর Redirect হবে)
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = SCRIPT_URL;
        form.style.display = 'none';
        
        const fields = {
            customerName: name,
            phone: phone,
            address: address,
            paymentMethod: selectedPayment === 'bkash' ? 'Bangla QR Pay' : 'Cash Payment',
            deliveryFee: deliveryFee,
            total: total
        };
        
        for (const key in fields) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
        }
        
        // Items গুলো JSON স্ট্রিং হিসেবে পাঠানো
        const itemsInput = document.createElement('input');
        itemsInput.type = 'hidden';
        itemsInput.name = 'items';
        itemsInput.value = JSON.stringify(orderItems);
        form.appendChild(itemsInput);
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        // ✅ সফল হলে Cart খালি করা
        localStorage.removeItem('cart');
        localStorage.removeItem('single_product');
        
        // ✅ Thanks Page-এ যাওয়া (form.submit() এর পরে)
        window.location.href = 'thanks.html';
    } catch (error) {
        alert('Error placing order: ' + error.message);
    }
};

loadDeliveryFee();
loadOrderSummary();
