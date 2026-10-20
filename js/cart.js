/**
 * Krishnam Poshak - Global Shopping Cart & Slide-Out Drawer Manager
 * Supports:
 * - Persistent cart with localStorage
 * - Open/Close drawer on navbar bag click, overlay click, close btn
 * - Add to Cart from cards and Quick View modal
 * - Dynamic drawer items rendering with images, titles, quantity adjustments, item removal
 * - Real-time subtotal calculation & free shipping banner
 * - Synchronized cart badge counter
 */

(function () {
  const STORAGE_KEY = 'kp_luxury_cart';

  function loadCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      let items = data ? JSON.parse(data) : [];
      // Clean and sanitize loaded items
      return items.map(it => {
        let p = parsePrice(it.price);
        if (!p || p === 0) {
          // If stored title matches known items, auto-assign correct price
          if (it.title && it.title.includes('80 Gram Crepe')) p = 2350;
          else if (it.title && it.title.includes('Kalamkari')) p = 2150;
          else if (it.title && it.title.includes('Bember Georgette')) p = 2450;
          else if (it.title && it.title.includes('Organza')) p = 1790;
          else if (it.title && it.title.includes('Muslin Silk')) p = 1890;
          else if (it.title && it.title.includes('Kaftan')) p = 1290;
          else p = 1450;
        }
        return {
          ...it,
          price: p,
          priceDisplay: formatPrice(p)
        };
      });
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }

  function parsePrice(priceStr) {
    if (priceStr === undefined || priceStr === null) return 0;
    if (typeof priceStr === 'number') return isNaN(priceStr) ? 0 : priceStr;
    // Extract first valid integer or decimal number
    const match = priceStr.toString().replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  }

  function formatPrice(num) {
    return '₹' + Math.round(num).toLocaleString('en-IN');
  }

  window.KrishnamCart = {
    items: loadCart(),

    init: function () {
      this.bindEvents();
      this.updateBadges();
      this.renderDrawer();
    },

    addItem: function (item, autoOpen = true) {
      const priceNum = parsePrice(item.price);
      const existing = this.items.find(i => i.title === item.title);

      if (existing) {
        existing.qty += (item.qty || 1);
        if (!existing.price || existing.price === 0) {
          existing.price = priceNum;
        }
      } else {
        this.items.push({
          title: item.title || 'Premium Kurti Pant Set / Suit',
          price: priceNum,
          priceDisplay: formatPrice(priceNum),
          img: item.img || 'public/photos/image1.png',
          qty: item.qty || 1
        });
      }

      saveCart(this.items);
      this.updateBadges();
      this.renderDrawer();
      this.showToast(item.title || 'Item Added!');

      if (autoOpen) {
        this.openDrawer();
      }
    },

    updateQty: function (index, delta) {
      if (!this.items[index]) return;
      this.items[index].qty += delta;
      if (this.items[index].qty <= 0) {
        this.items.splice(index, 1);
      }
      saveCart(this.items);
      this.updateBadges();
      this.renderDrawer();
    },

    removeItem: function (index) {
      if (!this.items[index]) return;
      this.items.splice(index, 1);
      saveCart(this.items);
      this.updateBadges();
      this.renderDrawer();
    },

    clearCart: function () {
      this.items = [];
      saveCart(this.items);
      this.updateBadges();
      this.renderDrawer();
    },

    getTotalCount: function () {
      return this.items.reduce((sum, item) => sum + item.qty, 0);
    },

    getSubtotal: function () {
      return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    },

    updateBadges: function () {
      const count = this.getTotalCount();
      const badges = document.querySelectorAll('.cart-badge, .drawer-cart-count');
      badges.forEach(badge => {
        badge.textContent = count;
        if (badge.classList.contains('cart-badge')) {
          badge.style.transform = 'scale(1.25)';
          setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
        }
      });
    },

    openDrawer: function () {
      const drawer = document.getElementById('cartDrawer');
      const overlay = document.getElementById('cartDrawerOverlay');
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    closeDrawer: function () {
      const drawer = document.getElementById('cartDrawer');
      const overlay = document.getElementById('cartDrawerOverlay');
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    },

    renderDrawer: function () {
      const body = document.getElementById('cartDrawerBody');
      const subtotalEl = document.getElementById('cartSubtotalVal');
      if (!body) return;

      if (this.items.length === 0) {
        body.innerHTML = `
          <div class="cart-empty-state">
            <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <p>Your shopping bag is currently empty.</p>
            <a href="collections.html" class="cart-empty-shop-btn">EXPLORE COLLECTIONS</a>
          </div>
        `;
        if (subtotalEl) subtotalEl.textContent = '₹0';
        return;
      }

      let html = '';
      this.items.forEach((item, index) => {
        html += `
          <div class="cart-item" data-index="${index}">
            <img src="${item.img}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
              <div>
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
              </div>
              <div class="cart-item-qty-row">
                <div class="cart-qty-ctrl">
                  <button type="button" class="cart-qty-btn-minus" data-idx="${index}">−</button>
                  <span>${item.qty}</span>
                  <button type="button" class="cart-qty-btn-plus" data-idx="${index}">+</button>
                </div>
                <button type="button" class="cart-item-remove" data-idx="${index}">Remove</button>
              </div>
            </div>
          </div>
        `;
      });

      body.innerHTML = html;
      if (subtotalEl) {
        subtotalEl.textContent = formatPrice(this.getSubtotal());
      }

      body.querySelectorAll('.cart-qty-btn-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-idx'));
          KrishnamCart.updateQty(idx, -1);
        });
      });

      body.querySelectorAll('.cart-qty-btn-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-idx'));
          KrishnamCart.updateQty(idx, 1);
        });
      });

      body.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-idx'));
          KrishnamCart.removeItem(idx);
        });
      });
    },

    showToast: function (title) {
      const cartToast = document.getElementById('cartToast');
      const toastTitle = document.getElementById('toastTitle');
      if (!cartToast) return;
      if (toastTitle) toastTitle.textContent = title;
      cartToast.classList.add('show');
      setTimeout(() => {
        cartToast.classList.remove('show');
      }, 3500);
    },

    bindEvents: function () {
      const cartBtns = document.querySelectorAll('.nav-cart-btn');
      cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          KrishnamCart.openDrawer();
        });
      });

      const closeBtn = document.getElementById('cartDrawerClose');
      const overlay = document.getElementById('cartDrawerOverlay');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          KrishnamCart.closeDrawer();
        });
      }
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          e.preventDefault();
          KrishnamCart.closeDrawer();
        });
      }

      const checkoutBtn = document.querySelector('.cart-checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (KrishnamCart.items.length === 0) {
            alert('Your shopping bag is empty. Please add items to proceed!');
            return;
          }
          alert('Proceeding to checkout with ' + KrishnamCart.getTotalCount() + ' items (Total: ' + formatPrice(KrishnamCart.getSubtotal()) + '). Thank you for shopping with Veda Collection!');
        });
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => KrishnamCart.init());
  } else {
    KrishnamCart.init();
  }
})();
