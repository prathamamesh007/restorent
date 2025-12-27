// Menu Data
const menuData = [
    { id: 1, category: 'starters', name: 'Truffle Arancini', price: 18, desc: 'Crispy risotto balls with truffle oil and parmesan.', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=400' },
    { id: 2, category: 'starters', name: 'Wagyu Carpaccio', price: 24, desc: 'Thinly sliced Wagyu beef with rocket and balsamic.', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400' },
    { id: 3, category: 'mains', name: 'Pan-Seared Sea Bass', price: 38, desc: 'Fresh sea bass served with saffron risotto.', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400' },
    { id: 4, category: 'mains', name: 'A5 Wagyu Steak', price: 120, desc: 'Premium Japanese A5 Wagyu with gold flakes.', image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=400' },
    { id: 5, category: 'desserts', name: 'Valrhona Soufflé', price: 22, desc: 'Warm dark chocolate soufflé with vanilla bean cream.', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400' },
    { id: 6, category: 'drinks', name: 'Royal Gold Martini', price: 28, desc: 'Gin, dry vermouth, and edible 24k gold flakes.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400' }
];

// State
let cart = [];

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose = document.getElementById('cart-close');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const navbar = document.querySelector('.navbar');
const backToTop = document.getElementById('back-to-top');
const preloader = document.querySelector('.preloader');

// Initialize
window.addEventListener('load', () => {
    preloader.style.display = 'none';
    renderMenu('all');
    animateCounters();
});

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounter = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target.toLocaleString() + (target > 100 ? '+' : '');
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shrink');
        backToTop.style.display = 'flex';
    } else {
        navbar.classList.remove('shrink');
        backToTop.style.display = 'none';
    }
});

// Menu Filtering Logic
function renderMenu(category) {
    const filtered = category === 'all' ? menuData : menuData.filter(item => item.category === category);

    menuContainer.innerHTML = filtered.map(item => `
        <div class="menu-card" data-aos="fade-up">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-card-info">
                <div class="menu-header">
                    <h4>${item.name}</h4>
                    <span class="menu-price">$${item.price}</span>
                </div>
                <p class="menu-desc">${item.desc}</p>
                <div class="menu-footer">
                    <span class="badge">Must Try</span>
                    <button class="btn-primary" onclick="addToCart(${item.id})" style="padding: 10px 20px; font-size: 12px;">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.dataset.filter);
    });
});

// Cart Functionality
function addToCart(id) {
    const product = menuData.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    cartSidebar.classList.add('active');
}

function updateCartUI() {
    cartCount.innerText = cart.reduce((acc, item) => acc + item.qty, 0);

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-details">
                <h5>${item.name}</h5>
                <p>$${item.price} x ${item.qty}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">&times;</button>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    totalAmount.innerText = `$${total.toFixed(2)}`;
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

cartToggle.addEventListener('click', () => cartSidebar.classList.toggle('active'));
cartClose.addEventListener('click', () => cartSidebar.classList.remove('active'));

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form Validation
document.getElementById('reservation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! Your reservation request has been received. We will contact you shortly.');
    e.target.reset();
});

// Mobile Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');
    hamburger.classList.toggle('active');
});
