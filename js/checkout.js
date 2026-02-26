document.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();
    setupFormSubmission();
});

function loadOrderSummary() {
    // 1. Get Cart Data
    let cart = JSON.parse(localStorage.getItem('imbento-cart')) || [];
    const container = document.getElementById('order-summary-items');
    
    if (!container) return;

    // 2. Clear loading state
    container.innerHTML = '';

    // 3. Render Items
    if (cart.length === 0) {
        container.innerHTML = '<div class="s-item"><p>Your cart is empty.</p></div>';
        updateTotals(0);
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 's-item';
        itemEl.innerHTML = `
            <div class="s-img">${item.image || '📦'}</div>
            <div class="s-info">
                <div class="s-name">${item.name}</div>
                <div class="s-meta">Qty: ${item.qty} ${item.subtitle ? ' • ' + item.subtitle : ''}</div>
            </div>
            <div class="s-price">₱${itemTotal.toLocaleString()}</div>
        `;
        container.appendChild(itemEl);
    });

    // 4. Update Costs
    updateTotals(subtotal);
}

function updateTotals(subtotal) {
    const shipping = subtotal > 0 ? 50 : 0; // Flat rate shipping
    const total = subtotal + shipping;

    document.getElementById('summary-subtotal').textContent = '₱' + subtotal.toLocaleString();
    document.getElementById('summary-shipping').textContent = '₱' + shipping.toLocaleString();
    document.getElementById('summary-total').textContent = '₱' + total.toLocaleString();
}

function setupFormSubmission() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic Validation (HTML5 validators handle most)
        const btn = form.querySelector('.checkout-btn');
        const originalText = btn.textContent;
        
        // Simulate Processing
        btn.textContent = 'Processing...';
        btn.disabled = true;

        setTimeout(() => {
            // 1. Create Order Object
            const orderId = 'IM-2026-' + Math.floor(10000 + Math.random() * 90000);
            const cartFn = JSON.parse(localStorage.getItem('imbento-cart')) || [];
            
            // Calc totals again for security
            const sub = cartFn.reduce((s, i) => s + (i.price * i.qty), 0);
            const ship = sub > 0 ? 50 : 0;
            const tot = sub + ship;

            const newOrder = {
                id: orderId,
                date: new Date().toISOString(), // Keep full ISO for sorting
                items: cartFn,
                subtotal: sub,
                shipping: ship,
                total: tot,
                status: 'Processing', // Default status
                timeline: [
                    { label: 'Order Placed', date: new Date().toISOString(), done: true },
                    { label: 'Confirmed', date: new Date().toISOString(), done: true },
                    { label: 'Packed', date: null, done: false },
                    { label: 'Shipped', date: null, done: false },
                    { label: 'Delivered', date: null, done: false }
                ]
            };

            // 2. Save to Order History
            const orders = JSON.parse(localStorage.getItem('imbento-orders')) || [];
            orders.unshift(newOrder); // Add to top
            localStorage.setItem('imbento-orders', JSON.stringify(orders));

            // 3. Clear Cart
            localStorage.removeItem('imbento-cart'); 
            
            // 4. Redirect
            alert('Order placed successfully! Order ID: ' + orderId);
            window.location.href = 'orderhistory.html'; 
        }, 1500);
    });
}
