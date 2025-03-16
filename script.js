// Cart state
let cart = [];
let cartTotal = 0;

// Product state
let products = [
    {
        id: 1,
        name: {
            en: 'Fresh Vegetables',
            da: 'Friske Grøntsager'
        },
        price: 4.99,
        category: 'vegetables',
        image: 'https://via.placeholder.com/200'
    },
    {
        id: 2,
        name: {
            en: 'Organic Fruits',
            da: 'Økologisk Frugt'
        },
        price: 6.99,
        category: 'fruits',
        image: 'https://via.placeholder.com/200'
    },
    {
        id: 3,
        name: {
            en: 'Fresh Bread',
            da: 'Frisk Brød'
        },
        price: 3.99,
        category: 'bread',
        image: 'https://via.placeholder.com/200'
    },
    {
        id: 4,
        name: {
            en: 'Dairy Products',
            da: 'Mejeriprodukter'
        },
        price: 5.99,
        category: 'dairy',
        image: 'https://via.placeholder.com/200'
    }
];

// Filter state
let currentCategory = '';
let searchQuery = '';

// DOM Elements
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cartModal');
const cartItems = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const checkoutButton = document.querySelector('.checkout-button');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');
const productGrid = document.querySelector('.product-grid');

// Event Listeners
cartIcon.addEventListener('click', toggleCart);
checkoutButton.addEventListener('click', handleCheckout);
searchInput.addEventListener('input', handleSearch);
searchButton.addEventListener('click', handleSearch);
categoryFilter.addEventListener('change', handleCategoryFilter);

// Initialize products
displayProducts();

// Filter and search functions
function handleSearch() {
    searchQuery = searchInput.value.toLowerCase();
    displayProducts();
}

function handleCategoryFilter() {
    currentCategory = categoryFilter.value;
    displayProducts();
}

// Initialize translations on page load
window.addEventListener('load', () => {
    updatePageContent();
});

function displayProducts() {
    const filteredProducts = products.filter(product => {
        const productName = product.name[currentLanguage].toLowerCase();
        const matchesSearch = productName.includes(searchQuery);
        const matchesCategory = !currentCategory || product.category === currentCategory;
        return matchesSearch && matchesCategory;
    });

    productGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name[currentLanguage]}</h3>
            <p class="price">${t('products.price')}: $${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="handleAddToCart(event, ${product.id})">${t('products.addToCart')}</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Toggle cart visibility
function toggleCart() {
    cartModal.classList.toggle('active');
}

// Handle adding items to cart
function handleAddToCart(event) {
    const productCard = event.target.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
    
    // Add item to cart
    const cartItem = {
        name: productName,
        price: productPrice,
        quantity: 1
    };

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(cartItem);
    }

    updateCart();
    showNotification(`${t('cart.added')} ${productName}`);
}

// Update cart display
function updateCart() {
    // Clear current cart display
    cartItems.innerHTML = '';
    
    // Update cart total
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Update cart items display
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="item-controls">
                <button onclick="updateItemQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateItemQuantity('${item.name}', 1)">+</button>
                <button onclick="removeItem('${item.name}')">${t('cart.removed')}</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });

    // Update total display
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
}

// Update item quantity
function updateItemQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(itemName);
        } else {
            updateCart();
        }
    }
}

// Remove item from cart
function removeItem(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCart();
    showNotification(`${t('cart.removed')} ${itemName}`);
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification(t('cart.empty'));
        return;
    }
    
    // Here you would typically integrate with a payment processor
    alert(`${t('cart.thankYou')} ${t('cart.total')}: $${cartTotal.toFixed(2)}`);
    cart = [];
    updateCart();
    toggleCart();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close cart when clicking outside
document.addEventListener('click', (event) => {
    if (cartModal.classList.contains('active') && 
        !cartModal.contains(event.target) && 
        !cartIcon.contains(event.target)) {
        toggleCart();
    }
});