// Check if user is logged in and has admin role
window.addEventListener('load', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Display admin username
    document.getElementById('adminUsername').textContent = `Welcome, ${currentUser.username}`;
    
    // Load initial products
    loadProducts();
});

// Mock data (replace with actual database integration)
let products = [
    {
        id: 1,
        name: 'Fresh Vegetables',
        price: 4.99,
        image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="%23666" text-anchor="middle" dy=".3em">Vegetables</text></svg>',
        stock: 50,
        category: 'vegetables'
    },
    {
        id: 2,
        name: 'Organic Fruits',
        price: 6.99,
        image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="%23666" text-anchor="middle" dy=".3em">Fruits</text></svg>',
        stock: 30,
        category: 'fruits'
    }
];

// Contact details data
let contactDetails = {
    address: '123 Grocery Street, City, Country',
    phone: '+1 234 567 8900',
    email: 'contact@vdsgrocery.com',
    businessHours: 'Mon-Fri: 9am-8pm\nSat-Sun: 10am-6pm'
};

// Filter state
let adminSearchQuery = '';
let adminCurrentCategory = '';

// Event Listeners for search and filter
document.getElementById('adminSearchInput').addEventListener('input', handleAdminSearch);
document.getElementById('adminSearchButton').addEventListener('click', handleAdminSearch);
document.getElementById('adminCategoryFilter').addEventListener('change', handleAdminCategoryFilter);

// Handle admin search
function handleAdminSearch() {
    adminSearchQuery = document.getElementById('adminSearchInput').value.toLowerCase();
    loadProducts();
}

// Handle admin category filter
function handleAdminCategoryFilter() {
    adminCurrentCategory = document.getElementById('adminCategoryFilter').value;
    loadProducts();
}

// Load products into the admin dashboard
function loadProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(adminSearchQuery);
        const matchesCategory = !adminCurrentCategory || product.category === adminCurrentCategory;
        return matchesSearch && matchesCategory;
    });
    
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-card');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p>Stock: ${product.stock}</p>
            <div class="product-controls">
                <button onclick="editProduct(${product.id})" class="edit-button">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteProduct(${product.id})" class="delete-button">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        productList.appendChild(productElement);
    });
}

// Show add product modal
function showAddProductModal() {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Add Product';
    form.reset();
    modal.classList.add('active');
    
    // Update form submission handler
    form.onsubmit = handleAddProduct;
}

// Handle adding new product
function handleAddProduct(e) {
    e.preventDefault();
    
    const imageFile = document.getElementById('productImageFile').files[0];
    if (!imageFile) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const newProduct = {
            id: products.length + 1,
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            image: event.target.result,
            stock: parseInt(document.getElementById('productStock').value),
            category: document.getElementById('adminCategoryFilter').value || 'other'
        };
        
        products.push(newProduct);
        loadProducts();
        closeProductModal();
    };
    
    reader.readAsDataURL(imageFile);
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Edit Product';
    
    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productStock').value = product.stock;
    
    modal.classList.add('active');
    
    // Update form submission handler
    form.onsubmit = (e) => handleEditProduct(e, productId);
}

// Handle editing product
function handleEditProduct(e, productId) {
    e.preventDefault();
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    const imageFile = document.getElementById('productImageFile').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            updateProduct(productId, productIndex, event.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        updateProduct(productId, productIndex, products[productIndex].image);
    }
}

function updateProduct(productId, productIndex, imageUrl) {
    products[productIndex] = {
        id: productId,
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: imageUrl,
        stock: parseInt(document.getElementById('productStock').value),
        category: document.getElementById('adminCategoryFilter').value || 'other'
    };
    
    loadProducts();
    closeProductModal();
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        loadProducts();
    }
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
}

// Save contact details
function saveContactDetails() {
    contactDetails = {
        address: document.getElementById('storeAddress').value,
        phone: document.getElementById('storePhone').value,
        email: document.getElementById('storeEmail').value,
        businessHours: document.getElementById('businessHours').value
    };
    
    alert('Contact details saved successfully!');
}

// Load contact details
function loadContactDetails() {
    document.getElementById('storeAddress').value = contactDetails.address;
    document.getElementById('storePhone').value = contactDetails.phone;
    document.getElementById('storeEmail').value = contactDetails.email;
    document.getElementById('businessHours').value = contactDetails.businessHours;
}

// Initialize image preview
function initImagePreview() {
    const imageInput = document.getElementById('productImageFile');
    const preview = document.getElementById('imagePreview');
    
    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    });
}

// Initialize all features
window.addEventListener('load', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('adminUsername').textContent = `Welcome, ${currentUser.username}`;
    loadProducts();
    loadContactDetails();
    initImagePreview();
});

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}