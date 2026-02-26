  // Cards per mode+tab
  const cards = {
    buyer: ['c-buyer-login','c-buyer-reg'],
    seller: ['c-seller-login','c-seller-reg']
  };

  const tabLabels = {
    buyer:  ['Log In','Create Account'],
    seller: ['Login as Seller','Become a Seller']
  };

  let mode = 'buyer';
  let tab  = 0;

  function render() {
    // who toggle
    document.getElementById('who-buyer').className = 'who-btn' + (mode==='buyer'?' active':'');
    document.getElementById('who-seller').className = 'who-btn' + (mode==='seller'?' active-seller':'');

    // tab labels & active class
    const activeClass = mode==='seller' ? 'tab-btn active-seller' : 'tab-btn active';
    document.getElementById('tab0').className = tab===0 ? activeClass : 'tab-btn';
    document.getElementById('tab1').className = tab===1 ? activeClass : 'tab-btn';
    document.getElementById('tab0').textContent = tabLabels[mode][0];
    document.getElementById('tab1').textContent = tabLabels[mode][1];

    // show correct card
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.getElementById(cards[mode][tab]).classList.add('active');
  }

  function setMode(m) { mode = m; tab = 0; render(); }
  function switchTab(t) { tab = t; render(); }

  function togglePw(id) {
    const el = document.getElementById(id);
    el.type = el.type === 'password' ? 'text' : 'password';
  }

  // Initialize from URL params
  function init() {
    const params = new URLSearchParams(window.location.search);
    const pMode = params.get('mode');
    const pTab = params.get('tab');

    if (pMode === 'seller') mode = 'seller';
    else mode = 'buyer';

    if (pTab === 'register') tab = 1;
    else tab = 0; // default to login

    render();
    attachHomeRedirects();
  }

  function attachHomeRedirects() {
    // Buyer Login
    const bLogin = document.querySelector('#c-buyer-login .btn-primary');
    if(bLogin) bLogin.onclick = () => window.location.href = 'index.html';

    // Buyer Register
    const bReg = document.querySelector('#c-buyer-reg .btn-primary');
    if(bReg) bReg.onclick = () => window.location.href = 'index.html';

    // Seller Login
    const sLogin = document.querySelector('#c-seller-login .btn-primary');
    if(sLogin) sLogin.onclick = () => window.location.href = 'index.html';

    // Seller Register
    const sReg = document.querySelector('#c-seller-reg .btn-primary');
    if(sReg) sReg.onclick = () => window.location.href = 'index.html';
  }

  // Run init on load
  window.addEventListener('DOMContentLoaded', init);