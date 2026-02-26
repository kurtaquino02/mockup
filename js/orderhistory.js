document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    updateOrderHistoryWishlistCount();
});


let currentPage = 1;
const ITEMS_PER_PAGE = 5;

// ── LOAD & RENDER ──
function loadOrders() {
    const raw = localStorage.getItem('imbento-orders');
    const orders = raw ? JSON.parse(raw) : [];
    
    // Initial sort by newest
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Store globally for filtering/pagination
    window.allOrders = orders;
    window.filteredOrders = [...orders];

    renderOrders();
}

function renderOrders() {
    const container = document.getElementById('orders-container');
    if(!container) return;

    const orders = window.filteredOrders || [];

    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;background:white;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.04);">
                <div style="font-size:40px;margin-bottom:10px;">📦</div>
                <h3 style="margin-bottom:10px;font-family:'Syne'">No orders found</h3>
                <p style="color:#666;margin-bottom:20px;">Try adjusting your search or filters.</p>
                ${window.allOrders.length === 0 ? `<button onclick="window.location='index.html'" style="background:var(--brand,#2D1B69);color:white;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:600">Start Shopping</button>` : ''}
            </div>
        `;
        const pag = document.getElementById('pagination-controls');
        if(pag) pag.style.display = 'none';
        
        updateStats(window.allOrders);
        return;
    }

    // Pagination Logic
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageOrders = orders.slice(start, end);

    let html = '';
    pageOrders.forEach(order => {
        html += generateOrderHTML(order);
    });

    container.innerHTML = html;
    updateStats(window.allOrders); // Stats always based on ALL orders? Or filtered? Usually stats on top are total.
    
    // Result count based on filtered
    const resultCount = document.getElementById('resultCount');
    if(resultCount) resultCount.textContent = orders.length;

    updatePagination(orders.length);
}

function generateOrderHTML(order) {
    // Generate Items HTML
    let itemsHtml = '';
    if(order.items && order.items.length > 0) {
        order.items.forEach(item => {
            const subtitle = item.subtitle || (item.variant ? item.variant : '') || (item.qty > 1 ? item.qty + 'x' : '');
            itemsHtml += `
                <div class="order-item" onclick="window.location='product.html?id=${item.id}'" style="cursor:pointer">
                    <div class="oi-img" style="background:#f9fafb;display:flex;align-items:center;justify-content:center;font-size:24px">${item.image || '📦'}</div>
                    <div class="oi-info">
                        <div class="oi-name">${item.name}</div>
                        <div class="oi-variant">${subtitle}</div>
                        <div class="oi-qty">Qty: ${item.qty}</div>
                    </div>
                    <div class="oi-price">₱${(item.price * item.qty).toLocaleString()}</div>
                </div>
            `;
        });
    }

    // Status & Timeline
    const status = order.status || 'Processing';
    const statusLower = status.toLowerCase();
    const timelineHtml = generateTimeline(status, order.date);

    // Styling classes
    let statusClass = 'status-processing';
    if(statusLower.includes('shipped') || statusLower.includes('transit')) statusClass = 'status-shipped';
    else if(statusLower === 'delivered') statusClass = 'status-delivered';
    else if(statusLower === 'cancelled') statusClass = 'status-cancelled';

    // Date
    const d = new Date(order.date);
    const dateStr = isNaN(d) ? order.date : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const count = order.items ? order.items.length : 0;

    // Subtotals
    const shippingCost = order.shipping || (statusLower === 'shipped' ? 120 : 0); // fallback
    const total = order.total || 0;
    const subtotal = order.subtotal || (total - shippingCost);

    return `
    <div class="order-card" data-status="${statusLower}" data-amount="${total}" data-date="${order.date}" id="${order.id}">
      <div class="order-header" onclick="toggleOrder('${order.id}')">
        <div>
          <div class="order-num"># ${order.id}</div>
          <div class="order-date">${dateStr} · ${count} items</div>
        </div>
        <div class="order-status ${statusClass}">${getIconForStatus(status)} ${status}</div>
        <div class="order-total-label">
          <div style="font-size:11px;color:var(--muted);margin-bottom:2px">Order Total</div>
          <div class="order-total-amount">₱${total.toLocaleString()}</div>
        </div>
        <div class="order-expand-btn">▾</div>
      </div>
      <div class="order-body">
        <div class="order-items">
            ${itemsHtml}
        </div>
        <div class="order-timeline">
            ${timelineHtml}
        </div>
        <div class="order-footer-row">
          <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${generateActionButtons(status, order)}
          </div>
          <div class="order-subtotals">
            <div>Subtotal <span>₱${subtotal.toLocaleString()}</span></div>
            <div>Shipping <span>${shippingCost === 0 ? '<span style="color:var(--green)">FREE</span>' : '₱'+shippingCost.toLocaleString()}</span></div>
            <div class="grand">Total: ₱${total.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
    `;
}

function generateActionButtons(status, order) {
    const s = status.toLowerCase();
    
    // Dynamic Buttons based on Status
    let mainBtn = '';
    
    if (s.includes('deliver')) {
        mainBtn = `<button class="order-action-btn primary" onclick="event.stopPropagation(); window.openReviewModal('${order.id}')">⭐ Rate</button>`;
    } else if (s.includes('ship') || s.includes('transit')) {
        mainBtn = `<button class="order-action-btn primary" onclick="event.stopPropagation(); window.showToast('Tracking: IM-TRACK-8821','brand')">📍 Track</button>`;
    } else if (s.includes('cancel')) {
        mainBtn = `<button class="order-action-btn" disabled style="opacity:0.5;cursor:not-allowed">Cancelled</button>`;
    } else {
        // Processing
        mainBtn = `<button class="order-action-btn danger" onclick="event.stopPropagation(); window.showToast('Cancellation Requested','red')">✕ Cancel</button>`;
    }

    return `
        ${mainBtn}
        <button class="order-action-btn" onclick="event.stopPropagation(); window.buyAgain('${order.id}')">🔁 Buy Again</button>
        <button class="order-action-btn" onclick="event.stopPropagation(); window.showToast('Invoice Downloaded','green')">📄 Invoice</button>
    `;
}

window.buyAgain = function(orderId) {
    const orders = JSON.parse(localStorage.getItem('imbento-orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if(order && order.items) {
        order.items.forEach(item => {
             // Use global addToCart if available
             if(typeof addToCart === 'function') addToCart(item, false);
        });
        showToast('Items added to cart!', 'green');
    }
};

window.openReviewModal = function() {
    const m = document.getElementById('reviewModal');
    if(m) m.classList.add('show'); 
};

function getIconForStatus(status) {
    const s = status.toLowerCase();
    if(s.includes('deliver')) return '✓';
    if(s.includes('ship') || s.includes('transit')) return '🚚';
    if(s.includes('cancel')) return '✕';
    return '⏳';
}

function generateTimeline(status, dateStr) {
    const s = status.toLowerCase();
    const d = new Date(dateStr);
    const shortDate = isNaN(d) ? 'Just now' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Base timeline
    let steps = [
        { label: 'Order Placed', time: shortDate, state: 'done' },
        { label: 'Confirmed', time: shortDate, state: 'done' },
        { label: 'Packed', time: 'Processing', state: 'pending' },
        { label: 'Shipped', time: 'Pending', state: 'pending' },
        { label: 'Delivered', time: 'Pending', state: 'pending' }
    ];

    if (s === 'processing') {
        steps[2].state = 'current'; 
    } else if (s.includes('shipped') || s.includes('transit')) {
        steps[2].state = 'done'; steps[2].time = shortDate;
        steps[3].state = 'current'; steps[3].time = 'Today';
    } else if (s === 'delivered') {
        steps.forEach(st => { st.state = 'done'; st.time = shortDate; });
    } else if (s === 'cancelled') {
         return `<div style="padding:15px;color:#991B1B;background:#FEF2F2;border:1px solid #FCA5A5;border-radius:12px;display:flex;align-items:center;gap:10px">
            <span>✕</span> This order was cancelled.
         </div>`;
    }

    return steps.map(step => `
        <div class="tl-step ${step.state}">
            <div class="tl-circle">${step.state === 'done' ? '✓' : (step.state === 'current' ? '⏳' : '')}</div>
            <div class="tl-label">${step.label}</div>
            <div class="tl-date">${step.time}</div>
        </div>
    `).join('');
}

// ── STATS & UI UPDATES ──
function updateStats(orders) {
    // 1. Calculate Counts
    let delivered = 0, shipped = 0, processing = 0, cancelled = 0;
    let totalSpent = 0;

    orders.forEach(o => {
        const s = (o.status || '').toLowerCase();
        if(s === 'delivered') delivered++;
        else if(s.includes('shipped') || s.includes('transit')) shipped++;
        else if(s === 'cancelled') cancelled++;
        else processing++; // Default to processing

        if(s !== 'cancelled') totalSpent += (o.total || 0);
    });

    const totalOrders = orders.length;

    // 2. Update Header
    setText('stat-total-orders', totalOrders);
    setText('stat-total-spent', '₱' + totalSpent.toLocaleString());
    setText('stat-delivered', delivered);
    setText('stat-shipped', shipped);
    setText('sidebar-order-count', totalOrders);

    // 3. Update Result Text
    setText('totalCount', totalOrders);
    setText('resultCount', totalOrders);

    // 4. Update Filter Tabs
    setText('filter-all', `All (${totalOrders})`);
    setText('filter-delivered', `Delivered (${delivered})`);
    setText('filter-shipped', `In Transit (${shipped})`);
    setText('filter-processing', `Processing (${processing})`);
    setText('filter-cancelled', `Cancelled (${cancelled})`);

    // 5. Sidebar Track Badges
    const badgeContainer = document.getElementById('track-order-badges');
    if (badgeContainer) {
        badgeContainer.innerHTML = '';
        if(delivered > 0) addBadge(badgeContainer, delivered, 'var(--green)');
        if(shipped > 0) addBadge(badgeContainer, shipped, '#2563EB');
        if(processing > 0) addBadge(badgeContainer, processing, '#F97316');
        if(cancelled > 0) addBadge(badgeContainer, cancelled, '#EF4444');
    }
}

function setText(id, txt) {
    const el = document.getElementById(id);
    if(el) el.textContent = txt;
}

function addBadge(parent, count, color) {
    const span = document.createElement('span');
    span.className = 'sni-badge';
    span.textContent = count;
    span.style.background = color;
    span.style.marginLeft = '0';
    parent.appendChild(span);
}


// ── INTERACTIONS ──
function toggleOrder(id) {
  const card = document.getElementById(id);
  if(card) card.classList.toggle('expanded');
}

function filterOrders(status, btn) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  if (status === 'all') {
      window.filteredOrders = [...window.allOrders];
  } else {
      window.filteredOrders = window.allOrders.filter(o => {
          const s = (o.status || '').toLowerCase();
          if (status === 'shipped') return s.includes('shipped') || s.includes('transit');
          return s === status;
      });
  }

  currentPage = 1;
  renderOrders();
}

function searchOrders(val) {
  const q = val.toLowerCase();
  
  if (!q) {
      // Re-apply current filter if needed, or just reset to all? 
      // For simplicity, let's search against ALL orders for now, ignoring tab filter slightly
      // or improved: search within the currently active filter context?
      // Design usually implies search overrides filter tabs or works within them.
      // Let's search across ALL orders for best UX.
      window.filteredOrders = [...window.allOrders];
  } else {
      window.filteredOrders = window.allOrders.filter(o => {
          // Search in ID, items names
          const idMatch = o.id.toLowerCase().includes(q);
          const itemMatch = o.items && o.items.some(i => i.name.toLowerCase().includes(q));
          return idMatch || itemMatch;
      });
  }
  
  currentPage = 1;
  renderOrders();
}

function sortOrders(val) {
  const orders = window.filteredOrders || [];
  
  orders.sort((a, b) => {
    const da = new Date(a.date || 0); 
    const db = new Date(b.date || 0);
    const aa = a.total || 0;
    const ab = b.total || 0;

    if (val === 'newest') return db - da; // Descending date
    if (val === 'oldest') return da - db; // Ascending date
    if (val === 'high') return ab - aa;   // Descending price
    if (val === 'low') return aa - ab;    // Ascending price
    return 0;
  });
  
  window.filteredOrders = orders;
  currentPage = 1;
  renderOrders();
  showToast('Orders sorted!', 'brand');
}

function updatePagination(count) {
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;
  const paginationControls = document.getElementById('pagination-controls');
  
  if(!paginationControls) return;

  if(totalPages <= 1) {
      paginationControls.style.display = 'none';
      return;
  } 
  
  paginationControls.style.display = 'flex';
  
  let html = `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
  
  for(let i=1; i<=totalPages; i++) {
      if (i === currentPage) {
          html += `<button class="page-btn active">${i}</button>`;
      } else {
          // simple logic: show all pages? or truncate? 
          // For now, show all (usually specific request if truncation needed)
          html += `<button class="page-btn" onclick="goToPage(${i})">${i}</button>`;
      }
  }
  
  html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
  
  paginationControls.innerHTML = html;
}

window.goToPage = function(p) {
    const count = window.filteredOrders.length;
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE) || 1;
    
    if(p < 1 || p > totalPages) return;
    
    currentPage = p;
    renderOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ── UTILS (Toast, Modal, Wishlist) ──

function showToast(msg, type = 'green') {
  const t = document.getElementById('toast');
  const ic = document.getElementById('toastIcon');
  if(!t) return;
  
  ic.style.background = type === 'green' ? 'var(--green)' : type === 'red' ? 'var(--red)' : 'var(--brand)';
  ic.textContent = type === 'green' ? '✓' : type === 'red' ? '✕' : '!';
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2800);
}

// Review Modal logic
let selectedStars = 0;
function openReviewModal() { 
    const m = document.getElementById('reviewModal');
    if(m) m.classList.add('show'); 
}
function closeReviewModal() { 
    const m = document.getElementById('reviewModal');
    if(m) m.classList.remove('show'); 
}
function setStars(n) {
  selectedStars = n;
  document.querySelectorAll('.star-pick').forEach((s, i) => {
    s.classList.toggle('lit', i < n);
  });
}
function submitReview() {
  if (!selectedStars) { showToast('Please select a star rating','red'); return; }
  closeReviewModal();
  showToast('⭐ Review submitted! Thank you.', 'green');
  selectedStars = 0;
  document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('lit'));
}
const reviewModal = document.getElementById('reviewModal');
if(reviewModal){
    reviewModal.addEventListener('click', function(e) {
        if (e.target === this) closeReviewModal();
    });
}

// Categories interaction
function toggleCat() {
    const trigger = document.getElementById('catTrigger');
    const menu = document.getElementById('catMenu');
    if(trigger) trigger.classList.toggle('open');
    if(menu) menu.classList.toggle('open');
}
function showPanel(id) {
    document.querySelectorAll('.cat-sidebar-item').forEach(el => el.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
    document.querySelectorAll('.cat-panel').forEach(p => p.classList.remove('active'));
    const p = document.getElementById('panel-' + id);
    if(p) p.classList.add('active');
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

function updateOrderHistoryWishlistCount() {
    // Fallback if wishlist-data.js isn't loaded
    const list = JSON.parse(localStorage.getItem('imbento-wishlist')) || [];
    const len = list.length;
    document.querySelectorAll('.js-wish-count').forEach(badge => {
      badge.textContent = len;
      badge.style.display = len > 0 ? 'inline-block' : 'none';
      badge.style.background = '#EF4444';
    });
}
window.addEventListener('storage', (e) => {
    if (e.key === 'imbento-wishlist') updateOrderHistoryWishlistCount();
});