// Cart Page Specific Logic
document.addEventListener('DOMContentLoaded', () => {

    // --- Category Toggle ---
    const trigger = document.getElementById('catTrigger');
    const menu = document.getElementById('catMenu');
    
    if (trigger && menu) {
        // Remove existing onclick if any? No, we handle it here.
        // It's safer to attach via ID if the user removes inline onclick.
        trigger.addEventListener('click', (e) => {
            e.stopPropagation(); // If this breaks anything, verify HTML structure
            trigger.classList.toggle('open');
            menu.classList.toggle('open');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            // Check if click is outside menu and trigger
            if (!menu.contains(e.target) && !trigger.contains(e.target)) {
                menu.classList.remove('open');
                trigger.classList.remove('open');
            }
        });
    }

    // --- Panel Navigation (Hover) ---
    const sidebarItems = document.querySelectorAll('.cat-sidebar-item');
    const panels = document.querySelectorAll('.cat-panel');

    sidebarItems.forEach(item => {
        // Handle Mouse Enter for Hover effect
        item.addEventListener('mouseenter', (e) => {
            // Get target panel ID from data attribute
            // We expect HTML to have data-panel="home" (refactored from onmouseenter="showPanel('home')")
            // Or extract from onclick if not refactored yet.
            // But we ARE refactoring HTML too.
            const targetId = item.getAttribute('data-panel');
            if (!targetId) return;

            // Remove active class from all items
            sidebarItems.forEach(el => el.classList.remove('active'));
            // Add active class to current item
            item.classList.add('active');

            // Hide all panels
            panels.forEach(p => p.classList.remove('active'));

            // Show corresponding panel
            const targetPanel = document.getElementById('panel-' + targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // --- Cart Toggle Integration ---
    // Make sure toggleCart is callable
    const cartBtns = document.querySelectorAll('.cart-btn, .close-cart, #cartOverlay');
    cartBtns.forEach(btn => {
        // If inline onclick exists, this listener adds another call.
        // We will remove inline onclicks in HTML refactor.
        btn.addEventListener('click', () => {
             // Use the global function from js/cart.js if available
            if (typeof window.toggleCart === 'function') {
                window.toggleCart();
            } else {
                const overlay = document.getElementById('cartOverlay');
                const sidebar = document.getElementById('cartSidebar');
                if (overlay && sidebar) {
                    overlay.classList.toggle('open');
                    sidebar.classList.toggle('open');
                    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
                }
            }
        });
    });

});
