// admin/assets/js/products.js

import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from './firebase.js';

// Load Products List
export async function loadProducts() {
    const table = document.getElementById('products-table');
    if (!table) return;

    const snap = await getDocs(collection(db, "products"));
    
    table.innerHTML = '';
    snap.forEach(doc => {
        const p = doc.data();
        const stockClass = p.stock === "Available" ? 'status-completed' : 'status-cancelled';
        table.innerHTML += `
            <tr>
                <td><img src="${p.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;"></td>
                <td>${p.name}</td>
                <td>৳ ${p.price}</td>
                <td>${p.category}</td>
                <td><span class="status-badge ${stockClass}">${p.stock}</span></td>
                <td>
                    <a href="edit-product.html?id=${doc.id}" class="btn btn-edit">Edit</a>
                    <button class="btn btn-danger" onclick="deleteProduct('${doc.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Load Categories for Dropdown
export async function loadCategoriesForDropdown() {
    const select = document.getElementById('product-category');
    if (!select) return;

    const catSnap = await getDocs(collection(db, "categories"));
    catSnap.forEach(doc => {
        select.innerHTML += `<option value="${doc.data().name}">${doc.data().name}</option>`;
    });
}

// Add Product
export async function saveProduct() {
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    const description = document.getElementById('product-description').value;
    const stock = document.getElementById('product-stock').value;
    const unit = document.getElementById('product-unit').value;

    if(!name || !price || !category || !image) {
        alert('Please fill all required fields!');
        return;
    }

    try {
        await addDoc(collection(db, "products"), {
            name: name,
            price: price,
            category: category,
            image: image,
            description: description,
            stock: stock,
            unit: unit
        });
        alert('Product added successfully!');
        window.location.href = 'products.html';
    } catch (error) {
        alert('Error adding product: ' + error.message);
    }
}

// Load Product for Edit
export async function loadProductForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId || !document.getElementById('product-id')) return;

    document.getElementById('product-id').value = productId;
    await loadCategoriesForDropdown();

    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const p = docSnap.data();
        document.getElementById('product-name').value = p.name;
        document.getElementById('product-price').value = p.price;
        document.getElementById('product-category').value = p.category;
        document.getElementById('product-image').value = p.image;
        document.getElementById('product-description').value = p.description || '';
        document.getElementById('product-stock').value = p.stock;
        document.getElementById('product-unit').value = p.unit;
    }
}

// Update Product
export async function updateProduct() {
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    const description = document.getElementById('product-description').value;
    const stock = document.getElementById('product-stock').value;
    const unit = document.getElementById('product-unit').value;

    if(!name || !price || !category || !image) {
        alert('Please fill all required fields!');
        return;
    }

    try {
        await updateDoc(doc(db, "products", productId), {
            name: name,
            price: price,
            category: category,
            image: image,
            description: description,
            stock: stock,
            unit: unit
        });
        alert('Product updated successfully!');
        window.location.href = 'products.html';
    } catch (error) {
        alert('Error updating product: ' + error.message);
    }
}

// Delete Product
export async function deleteProduct(id) {
    if(confirm('Are you sure?')) {
        await deleteDoc(doc(db, "products", id));
        loadProducts();
    }
}