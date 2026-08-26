import { db, collection, getDocs, deleteDoc, doc } from './firebase.js';

async function loadCategories() {
    const table = document.getElementById('categories-table');
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
    if(confirm('Are you sure you want to delete this category?')) {
        await deleteDoc(doc(db, "categories", id));
        loadCategories();
    }
};

loadCategories()