// Functions for Features page
function wishItem(btn, product){
    // Determine current state based on button text
    const isWishlisted = btn.textContent === '❤️';
    
    // Get current wishlist from storage (using wishlist-data.js helper if available, or fallback)
    let wishlist = [];
    if (typeof getWishlist === 'function') {
        wishlist = getWishlist();
    } else {
        // Fallback if wishlist-data.js not loaded
        try {
            wishlist = JSON.parse(localStorage.getItem('imbento-wishlist')) || [];
        } catch(e) { wishlist = []; }
    }

    if (isWishlisted) {
        // Remove item
        wishlist = wishlist.filter(item => item.id !== product.id);
        btn.textContent = '♡';
        showToast('Removed from wishlist', 'red');
    } else {
        // Add item if not already present
        if (!wishlist.some(item => item.id === product.id)) {
            wishlist.push(product);
        }
        btn.textContent = '❤️';
        showToast('❤️ Saved to wishlist', 'brand');
    }
    
    // Save back to storage
    localStorage.setItem('imbento-wishlist', JSON.stringify(wishlist));
    
    // Update header count if available
    updateWishlistCount(wishlist.length);
}

function updateWishlistCount(count) {
    // Optional: update a wishlist counter in header if it exists
    const badge = document.getElementById('wishlist-count');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function showToast(msg,type='green'){
    const t=document.getElementById('toast');
    const ic=document.getElementById('toastIcon');
    if(!t || !ic) return; // Guard clause
    ic.style.background=type==='green'?'var(--green)':type==='red'?'var(--red)':'var(--brand)';
    ic.textContent=type==='green'?'✓':type==='red'?'✕':'!';
    document.getElementById('toastMsg').textContent=msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t=setTimeout(()=>t.classList.remove('show'),2800);
}

// Initialize wishlist state on load
document.addEventListener('DOMContentLoaded', () => {
    try {
        const wishlist = JSON.parse(localStorage.getItem('imbento-wishlist') || '[]');
        const buttons = document.querySelectorAll('button[onclick^="wishItem"]');
        
        buttons.forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            const match = onclick.match(/id:\s*(\d+)/);
            if (match && match[1]) {
                const id = parseInt(match[1]);
                if (wishlist.some(item => item.id === id)) {
                    btn.textContent = '❤️';
                }
            }
        });
        updateWishlistCount(wishlist.length);
    } catch(e) { console.error('Error syncing wishlist state', e); }
});

function copyCode(){
    showToast('✅ Code PINOY2026 copied!','green');
}

let total=11*3600+47*60+33;
function tick(){
    if(total<=0)return;
    total--;
    const h=Math.floor(total/3600);
    const m=Math.floor((total%3600)/60);
    const s=total%60;
    const elH = document.getElementById('cdH');
    const elM = document.getElementById('cdM');
    const elS = document.getElementById('cdS');
    if(elH) elH.textContent=String(h).padStart(2,'0');
    if(elM) elM.textContent=String(m).padStart(2,'0');
    if(elS) elS.textContent=String(s).padStart(2,'0');
}
setInterval(tick,1000);

document.querySelectorAll('.cat-chip').forEach(chip=>{
    chip.addEventListener('click',function(e){
        e.preventDefault(); // Prevent jump
        
        // UI Toggle
        document.querySelectorAll('.cat-chip').forEach(c=>c.classList.remove('active'));
        this.classList.add('active');

        // Filtering Logic
        const filter = this.getAttribute('data-filter');
        if (!filter) return; // Guard

        const products = document.querySelectorAll('.feat-grid .feat-card');
        let count = 0;
        
        products.forEach(p => {
            const cat = p.getAttribute('data-category');
            // Check if matches filter (or show all)
            if (filter === 'all' || cat === filter) {
                p.style.display = ''; // Show
                count++;
            } else {
                p.style.display = 'none'; // Hide
            }
        });

        // Optional: Show message if no items found
        if(count === 0) showToast(`No products found for ${this.textContent.trim()}`, 'brand');
    });
});

function toggleCat() {
    const trigger = document.getElementById('catTrigger');
    const menu = document.getElementById('catMenu');
    trigger.classList.toggle('open');
    menu.classList.toggle('open');
}

function showPanel(id) {
    document.querySelectorAll('.cat-sidebar-item').forEach(el => el.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
    document.querySelectorAll('.cat-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + id);
    if(panel) panel.classList.add('active');
}

document.addEventListener('click', function(e) {
    const wrap = document.querySelector('.cat-dropdown-wrap');
    if (wrap && !wrap.contains(e.target)) {
        const trigger = document.getElementById('catTrigger');
        const menu = document.getElementById('catMenu');
        if (trigger) trigger.classList.remove('open');
        if (menu) menu.classList.remove('open');
    }
});
