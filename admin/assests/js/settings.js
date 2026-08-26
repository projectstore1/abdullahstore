import { db, doc, getDoc, setDoc } from './firebase.js';

const settingsRef = doc(db, "settings", "general");

async function loadSettings() {
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('store-name').value = data.storeName || '';
        document.getElementById('delivery-fee').value = data.deliveryFee || 30;
        document.getElementById('qr-image').value = data.banglaQRImage || '';
    }
}

window.saveSettings = async () => {
    const storeName = document.getElementById('store-name').value;
    const deliveryFee = parseFloat(document.getElementById('delivery-fee').value);
    const banglaQRImage = document.getElementById('qr-image').value;

    await setDoc(settingsRef, {
        storeName: storeName,
        deliveryFee: deliveryFee,
        banglaQRImage: banglaQRImage
    });

    alert('Settings saved successfully!');
};

loadSettings();