// Language translations for VDS Grocery Store
const translations = {
    en: {
        // Navigation
        nav: {
            home: "Home",
            products: "Products",
            about: "About",
            contact: "Contact",
            search: "Search products...",
            login: "Login",
            logout: "Logout",
            welcome: "Welcome"
        },
        // Product related
        products: {
            addToCart: "Add to Cart",
            price: "Price",
            categories: {
                all: "All Categories",
                vegetables: "Vegetables",
                fruits: "Fruits",
                bread: "Bread",
                dairy: "Dairy"
            }
        },
        // Cart related
        cart: {
            title: "Shopping Cart",
            total: "Total",
            checkout: "Checkout",
            empty: "Your cart is empty",
            added: "Added",
            removed: "Removed",
            thankYou: "Thank you for your purchase!"
        },
        // Footer
        footer: {
            about: "About VDS Grocery",
            aboutText: "Your trusted source for fresh and quality groceries.",
            contact: "Contact Us",
            followUs: "Follow Us",
            rights: "All rights reserved."
        },
        // Login page
        login: {
            title: "Login",
            username: "Username",
            password: "Password",
            submit: "Login",
            invalid: "Invalid username or password"
        }
    },
    da: {
        // Navigation
        nav: {
            home: "Hjem",
            products: "Produkter",
            about: "Om os",
            contact: "Kontakt",
            search: "Søg produkter...",
            login: "Log ind",
            logout: "Log ud",
            welcome: "Velkommen"
        },
        // Product related
        products: {
            addToCart: "Læg i kurv",
            price: "Pris",
            categories: {
                all: "Alle kategorier",
                vegetables: "Grøntsager",
                fruits: "Frugt",
                bread: "Brød",
                dairy: "Mejeri"
            }
        },
        // Cart related
        cart: {
            title: "Indkøbskurv",
            total: "Total",
            checkout: "Til kassen",
            empty: "Din kurv er tom",
            added: "Tilføjet",
            removed: "Fjernet",
            thankYou: "Tak for dit køb!"
        },
        // Footer
        footer: {
            about: "Om VDS Grocery",
            aboutText: "Din pålidelige kilde til friske og kvalitets dagligvarer.",
            contact: "Kontakt os",
            followUs: "Følg os",
            rights: "Alle rettigheder forbeholdes."
        },
        // Login page
        login: {
            title: "Log ind",
            username: "Brugernavn",
            password: "Adgangskode",
            submit: "Log ind",
            invalid: "Ugyldigt brugernavn eller adgangskode"
        }
    }
};

// Current language
let currentLanguage = localStorage.getItem('language') || 'en';

// Function to get translation
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        value = value[k];
        if (value === undefined) return key;
    }
    
    return value;
}

// Function to change language
function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updatePageContent();
    }
}

// Function to update page content
function updatePageContent() {
    // Update navigation
    document.querySelector('a[href="#home"]').textContent = t('nav.home');
    document.querySelector('a[href="#products"]').textContent = t('nav.products');
    document.querySelector('a[href="#about"]').textContent = t('nav.about');
    document.querySelector('a[href="#contact"]').textContent = t('nav.contact');
    
    // Update search placeholder
    document.getElementById('searchInput').placeholder = t('nav.search');
    
    // Update login/logout buttons
    const loginButton = document.querySelector('.login-button');
    if (loginButton) loginButton.textContent = t('nav.login');
    
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) logoutButton.textContent = t('nav.logout');
    
    // Update welcome message if logged in
    const welcomeUser = document.getElementById('welcomeUser');
    if (welcomeUser && welcomeUser.textContent) {
        const username = welcomeUser.textContent.split(',')[1]?.trim() || '';
        welcomeUser.textContent = `${t('nav.welcome')}, ${username}`;
    }
    
    // Update footer
    document.querySelector('.footer-section h3').textContent = t('footer.about');
    document.querySelector('.footer-section p').textContent = t('footer.aboutText');
    document.querySelectorAll('.footer-section h3')[1].textContent = t('footer.contact');
    document.querySelectorAll('.footer-section h3')[2].textContent = t('footer.followUs');
    
    // Update products if on main page
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        displayProducts(); // This will use the new translations
    }
    
    // Update cart text if visible
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        document.querySelector('.cart-title').textContent = t('cart.title');
        document.querySelector('.checkout-button').textContent = t('cart.checkout');
    }
}