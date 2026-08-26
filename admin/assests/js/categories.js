// admin/assets/js/categories.js
import { db, collection, getDocs, addDoc, deleteDoc, doc } from './firebase.js';

async function loadCategories() {
    const table = document.getElementById('categories-table');
    if (!table) return;

    const snap = await getDocs(collection(db, "categories"));
    table.innerHTML = '';
    snap.forEach(doc => {
        const cat = doc.data();
        table.innerHTML += `
            <tr>
                <td><img src="${cat.image}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;"></td>
                <td>${cat.name}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteCategory('${doc.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

window.deleteCategory = async (id) => {
    if(confirm('Are you sure?')) {
        await deleteDoc(doc(db, "categories", id));
        loadCategories();
    }
};

// Add Category
window.saveCategory = async () => {
    const name = document.getElementById('category-name').value;
    const image = document.getElementById('category-image').value;

    if(!name || !image) {
        alert('Please fill all fields!');
        return;
    }

    try {
        await addDoc(collection(db, "categories"), {
            name: name,
            image: image
        });
        alert('Category added successfully!');
        window.location.href = 'categories.html';
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

if (document.getElementById('categories-table')) {
    loadCategories();
}
