// Product Data
const products = [
    {
        id: 1,
        title: "Smart Watch Pro",
        desc: "Stay connected with the latest Smart Watch Pro. Features include heart rate monitoring, GPS tracking, and 7-day battery life.",
        price: "$199.99",
        emoji: "⌚",
        color: "#ffe0b2"
    },
    {
        id: 2,
        title: "Noise Cancelling Headphones",
        desc: "Experience pure silence with our top-tier noise cancelling technology. Perfect for travelers and audiophiles.",
        price: "$299.99",
        emoji: "🎧",
        color: "#e1bee7"
    },
    {
        id: 3,
        title: "4K Action Camera",
        desc: "Capture your adventures in stunning 4K resolution. Waterproof up to 30 meters and includes a mounting kit.",
        price: "$149.99",
        emoji: "📸",
        color: "#c8e6c9"
    },
    {
        id: 4,
        title: "Retro Mechanical Keyboard",
        desc: "Clicky, tactile, and stylish. This mechanical keyboard features vintage-style round keycaps and RGB backlighting.",
        price: "$129.50",
        emoji: "⌨️",
        color: "#ffcdd2"
    },
    {
        id: 5,
        title: "Smart Home Hub",
        desc: "Control all your devices from one place. Compatible with lights, locks, and thermostats. Voice control enabled.",
        price: "$89.99",
        emoji: "🏠",
        color: "#b2dfdb"
    },
    {
        id: 6,
        title: "Portable Projector",
        desc: "Cinema in your pocket. projects up to 100 inches in HD. Battery lasts for 3 hours of playback.",
        price: "$249.00",
        emoji: "📽️",
        color: "#bbdefb"
    }
];

// DOM Elements
const grid = document.getElementById('products-grid');
const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');
const reviewForm = document.getElementById('review-form');

// Modal Elements
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const modalImage = document.getElementById('modal-image');

// Render Products
function renderProducts() {
    grid.innerHTML = products.map(product => `
        <article class="product-card" onclick="openProduct(${product.id})">
            <div class="product-image" style="background-color: ${product.color};">
                ${product.emoji}
            </div>
            <h2 class="product-title">${product.title}</h2>
            <p class="product-desc">${product.desc}</p>
            <div class="price">${product.price}</div>
            <button class="buy-btn">View Details</button>
        </article>
    `).join('');
}

// Open Modal
window.openProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    modalTitle.textContent = product.title;
    modalDesc.textContent = product.desc;
    modalPrice.textContent = product.price;
    modalImage.textContent = product.emoji;
    modalImage.style.backgroundColor = product.color;

    modal.showModal(); // Native Dialog API
};

// Close Modal Logic
closeModalBtn.addEventListener('click', () => {
    modal.close();
});

// Close when clicking backdrop
modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
        modal.close();
    }
});

// Handle Review Submit
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('review-text').value;
    alert(`Review submitted (Simulation):\n\n"${text}"`);
    document.getElementById('review-text').value = '';
    modal.close();
});

// Initialize
renderProducts();
