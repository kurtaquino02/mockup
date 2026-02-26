document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    let productId = params.get('id');

    // Default to 101 if no ID or invalid
    if (!productId || !getProductById(productId)) {
        productId = 101; 
        console.warn('Product ID not found, defaulting to 101');
    }

    const product = getProductById(productId);
    renderProduct(product);
});

function renderProduct(product) {
    if (!product) return;

    // Set Title, Meta Title
    document.title = `${product.name} – Imbento Masagana`;
    
    // Breadcrumb
    const bcLinks = document.querySelectorAll('.breadcrumb a');
    if(bcLinks.length >= 2) bcLinks[1].textContent = product.category;
    const bcSpan = document.querySelector('.breadcrumb span');
    if(bcSpan) bcSpan.textContent = product.name;

    // Gallery
    const mainImg = document.getElementById('mainImg');
    if (mainImg) {
        // Clear existing text node
        mainImg.innerHTML = `${product.image}
            <div class="img-badge-wrap">
                <div class="img-badge">Featured</div>
                <div class="img-badge sale">${product.stock || 'In Stock'}</div>
            </div>`;
    }

    const thumbRow = document.querySelector('.thumb-row');
    if (thumbRow && product.gallery) {
        thumbRow.innerHTML = '';
        product.gallery.forEach(( emoji, index ) => {
            const isActive = index === 0 ? 'active' : '';
            thumbRow.innerHTML += `<div class="thumb ${isActive}" onclick="setImg(this,'${emoji}')">${emoji}</div>`;
        });
    }

    // Info
    const catTag = document.querySelector('.product-category-tag');
    if(catTag) catTag.innerHTML = `${getCategoryEmoji(product.category)} ${product.category}`;
    
    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.product-subtitle').textContent = product.subtitle || '';
    
    // Ratings
    document.querySelector('.rating-score').textContent = product.stars;
    document.querySelector('.rating-count').textContent = `(${product.reviewCount} reviews)`;

    // Price
    document.querySelector('.price-main').textContent = `₱${product.price}`;
    if(product.oldPrice) {
        document.querySelector('.price-old').textContent = `₱${product.oldPrice}`;
        const saved = product.oldPrice - product.price;
        const percent = Math.round((saved / product.oldPrice) * 100);
        document.querySelector('.price-save').textContent = `Save ₱${saved} (${percent}% off)`;
        document.querySelector('.price-sub').style.display = 'flex';
    } else {
        document.querySelector('.price-sub').style.display = 'none';
    }

    // Seller
    if(product.seller) {
        document.querySelector('.seller-info strong').textContent = product.seller.name;
        document.querySelector('.seller-info span').textContent = `Member since ${product.seller.memberSince} · ${product.seller.productsSold} products sold`;
        document.querySelector('.seller-avatar').textContent = product.seller.avatar;
        document.querySelector('.seller-rating .s-stars').textContent = '★'.repeat(Math.round(product.seller.rating)) + '☆'.repeat(5 - Math.round(product.seller.rating));
        document.querySelector('.seller-rating span').textContent = `${product.seller.rating} seller rating`;
    }

    // Specs
    if(product.specs) {
        const specContainer = document.querySelector('#tab-desc .spec-table') || document.querySelector('#tab-specs .spec-table'); 
        // We might want to update both or just regenerate. For now let's reuse logic.
        // Actually, let's rebuild the rows.
        const rows = product.specs.map(s => 
            `<div class="spec-row"><div class="spec-key">${s.key}</div><div class="spec-val">${s.val}</div></div>`
        ).join('');
        
        document.querySelectorAll('.spec-table').forEach(table => {
            table.innerHTML = rows;
        });
    }

    // Variants (Dynamic)
    const variantContainer = document.querySelector('.product-info-col');
    // Remove existing variants to avoid dups if re-rendering
    const existingVariants = variantContainer.querySelectorAll('.variant-row, .option-label');
    existingVariants.forEach(el => el.remove());

    const actionRow = document.querySelector('.action-row');
    if (product.variants && product.variants.length > 0) {
        // Insert before action row
        product.variants.slice().reverse().forEach(v => {
            const label = document.createElement('div');
            label.className = 'option-label';
            label.textContent = v.name;
            
            const row = document.createElement('div');
            row.className = 'variant-row';
            v.options.forEach((opt, idx) => {
                row.innerHTML += `<div class="variant-chip ${idx===0?'active':''}">${opt}</div>`;
            });

            variantContainer.insertBefore(row, actionRow);
            variantContainer.insertBefore(label, row);
        });
        
        // Re-attach listeners
        attachVariantListeners();
    }
    
    // Update Add to Cart Button Logic
    const addBtn = document.querySelector('.btn-add-cart');
    addBtn.setAttribute('onclick', `addToCartWrapper(${product.id})`);

    // Reviews (Basic count update)
    const reviewTabBtn = document.querySelector('button[onclick^="showTab(\'reviews\'"]');
    if(reviewTabBtn) reviewTabBtn.textContent = `Reviews (${product.reviewCount})`;
}

function getCategoryEmoji(cat) {
    if(cat.includes('Home')) return '🏠';
    if(cat.includes('Beauty')) return '💄';
    if(cat.includes('Food')) return '🍜';
    if(cat.includes('Health')) return '🌿';
    if(cat.includes('Light')) return '💡';
    return '📦';
}

// Logic Helpers
let qty = 1;

function changeQty(d) {
    qty = Math.max(1, qty + d);
    document.getElementById('qty').textContent = qty;
}

function setImg(el, emoji) {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    
    const mainImg = document.getElementById('mainImg');
    // Keep badges, just change text ID... wait, structure is text then div.
    // Easier to just rebuild innerHTML or replace text node.
    // Let's assume text is first child.
    if(mainImg.firstChild.nodeType === 3) {
         mainImg.firstChild.textContent = emoji;
    } else {
        // If wrapped or structured differently
        mainImg.innerHTML = `${emoji}
            <div class="img-badge-wrap">
                <div class="img-badge">Featured</div>
                <div class="img-badge sale">In Stock</div>
            </div>`;
    }
}

function attachVariantListeners() {
    document.querySelectorAll('.variant-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            const row = this.closest('.variant-row');
            row.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showTab(id, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    btn.classList.add('active');
}

function addToCartWrapper(id) {
    const product = getProductById(id);
    // Get active variants
    let variants = [];
    document.querySelectorAll('.variant-row').forEach(row => {
        const active = row.querySelector('.active');
        if(active) variants.push(active.textContent);
    });

    const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty,
        subtitle: variants.join(', ')
    };

    // Use global addToCart from cart.js
    if(typeof addToCart === 'function') {
        // addToCart usually takes (product, openSidebar)
        addToCart(item, false);
    } else {
        console.error('Cart logic not loaded');
    }
}
