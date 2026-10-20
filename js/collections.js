/**
 * Collections Page Interactions:
 * - Grid Columns switcher (2 cols, 4 cols, 6 cols)
 * - Sort By Dropdown
 * - Filter Sidebar Drawer Toggle
 * - Size selector pills
 * - Wishlist heart toggle
 * - QUICK VIEW POPUP MODAL (Working & Live)
 * - ADD TO CART (Cart counter + Toast notification + Button feedback)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Navbar for mobile drawer
  if (typeof Navbar !== 'undefined') {
    new Navbar();
  }

  // Cart state
  let cartCount = 0;
  const cartBadges = document.querySelectorAll('.cart-badge');
  const cartToast = document.getElementById('cartToast');
  const toastTitle = document.getElementById('toastTitle');

  const showToast = (title) => {
    if (!cartToast) return;
    if (toastTitle) toastTitle.textContent = title;
    cartToast.classList.add('show');
    setTimeout(() => {
      cartToast.classList.remove('show');
    }, 3500);
  };

  const updateCartCount = () => {
    cartCount++;
    cartBadges.forEach(badge => {
      badge.textContent = cartCount;
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => {
        badge.style.transform = 'scale(1)';
      }, 200);
    });
  };

  // 1. Grid View Switchers (2, 4, 6 columns)
  const viewSwitchBtns = document.querySelectorAll('.view-switch-btn');
  const productsGrid = document.querySelector('.collections-products-grid');

  if (viewSwitchBtns.length > 0 && productsGrid) {
    viewSwitchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewSwitchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cols = btn.getAttribute('data-cols');
        productsGrid.className = `collections-products-grid grid-cols-${cols}`;
      });
    });
  }

  // 2. Sort By Dropdown
  const sortByWrapper = document.querySelector('.sort-by-wrapper');
  const sortByBtn = document.querySelector('.sort-by-btn');
  const sortOptions = document.querySelectorAll('.sort-option-item');

  if (sortByWrapper && sortByBtn) {
    sortByBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sortByWrapper.classList.toggle('open');
    });

    sortOptions.forEach(option => {
      option.addEventListener('click', () => {
        sortOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        sortByWrapper.classList.remove('open');
      });
    });

    document.addEventListener('click', () => {
      sortByWrapper.classList.remove('open');
    });
  }

  // 3. Filter Drawer Open & Close
  const filterDrawerBtn = document.querySelector('.filter-drawer-btn');
  const filterDrawer = document.querySelector('.filter-drawer');
  const filterOverlay = document.querySelector('.filter-drawer-overlay');
  const filterCloseBtn = document.querySelector('.filter-close-btn');
  const filterResetBtn = document.querySelector('.filter-reset-btn');
  const filterApplyBtn = document.querySelector('.filter-apply-btn');

  const openFilter = () => {
    if (filterDrawer && filterOverlay) {
      filterDrawer.classList.add('open');
      filterOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeFilter = () => {
    if (filterDrawer && filterOverlay) {
      filterDrawer.classList.remove('open');
      filterOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (filterDrawerBtn) filterDrawerBtn.addEventListener('click', openFilter);
  if (filterCloseBtn) filterCloseBtn.addEventListener('click', closeFilter);
  if (filterOverlay) filterOverlay.addEventListener('click', closeFilter);
  if (filterApplyBtn) filterApplyBtn.addEventListener('click', closeFilter);

  if (filterResetBtn) {
    filterResetBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.filter-drawer input');
      inputs.forEach(input => {
        input.checked = false;
      });
    });
  }

  // 4. Size Pills selector on cards
  const sizePills = document.querySelectorAll('.size-pill');
  sizePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const parentRow = pill.closest('.card-size-row');
      if (parentRow) {
        parentRow.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }
    });
  });

  // 5. Wishlist & Action Sidebar Buttons in Collections
  const wishlistBtns = document.querySelectorAll('.card-wishlist-btn, .action-wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      const card = btn.closest('.collection-card');
      const title = card ? (card.querySelector('.card-title') || {}).textContent : 'Item';
      showToast(btn.classList.contains('active') ? `Added to Wishlist: ${title.trim()}` : `Removed from Wishlist`);
    });
  });

  const compareBtns = document.querySelectorAll('.action-compare-btn');
  compareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.add('spinning');
      setTimeout(() => btn.classList.remove('spinning'), 700);
      const card = btn.closest('.collection-card');
      const title = card ? (card.querySelector('.card-title') || {}).textContent : 'Item';
      showToast(`Added to Compare: ${title.trim()}`);
    });
  });

  // Action Quick View Buttons in Collections
  const actionQuickViewBtns = document.querySelectorAll('.action-quickview-btn');
  actionQuickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.collection-card');
      openQuickView(card);
    });
  });

  // Select Options Bar click in Collections - Add directly to cart with exact price
  const selectOptionsBars = document.querySelectorAll('.select-options-bar');
  selectOptionsBars.forEach(bar => {
    bar.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = bar.closest('.collection-card');
      const titleEl = card ? card.querySelector('.card-title') : null;
      const priceEl = card ? card.querySelector('.card-sale-price') : null;
      const imgEl = card ? card.querySelector('.card-img-primary') : null;

      const title = titleEl ? titleEl.textContent.trim() : 'Designer Kurti Pant Set';
      const price = priceEl ? priceEl.textContent.trim() : 'Rs. 1,290';
      const img = imgEl ? imgEl.getAttribute('src') : 'public/photos/image1.png';

      if (window.KrishnamCart) {
        window.KrishnamCart.addItem({ title, price, img, qty: 1 }, true);
      }
    });
  });

  // 6. ADD TO CART Button Handlers (on Product Cards)
  const addToCartBtns = document.querySelectorAll('.card-add-to-cart-btn');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.collection-card');
      const titleEl = card ? card.querySelector('.card-title') : null;
      const priceEl = card ? card.querySelector('.card-sale-price') : null;
      const imgEl = card ? card.querySelector('.card-img-primary') : null;

      const title = titleEl ? titleEl.textContent.trim() : 'Luxury Rajputi Poshak';
      const price = priceEl ? priceEl.textContent.trim() : '₹18,999';
      const img = imgEl ? imgEl.getAttribute('src') : 'public/photos/image1.png';

      // Button feedback animation
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>✓ ADDED</span>';
      btn.style.backgroundColor = '#2e7d32';
      
      if (window.KrishnamCart) {
        window.KrishnamCart.addItem({ title, price, img, qty: 1 }, true);
      } else {
        updateCartCount();
        showToast(title);
      }

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.backgroundColor = '';
      }, 1500);
    });
  });

  // 7. QUICK VIEW MODAL LOGIC
  const quickViewOverlay = document.getElementById('quickViewOverlay');
  const quickViewModal = document.getElementById('quickViewModal');
  const quickViewClose = document.getElementById('quickViewClose');
  const qvImage = document.getElementById('qvImage');
  const qvBadge = document.getElementById('qvBadge');
  const qvTitle = document.getElementById('qvTitle');
  const qvPrice = document.getElementById('qvPrice');
  const qvOriginalPrice = document.getElementById('qvOriginalPrice');
  const qvAddToCartBtn = document.getElementById('qvAddToCartBtn');

  const openQuickView = (card) => {
    if (!quickViewModal || !card) return;

    const img = card.querySelector('.card-img-primary') ? card.querySelector('.card-img-primary').src : '';
    const badge = card.querySelector('.card-discount-badge') ? card.querySelector('.card-discount-badge').textContent : 'SAVE 20%';
    const title = card.querySelector('.card-title') ? card.querySelector('.card-title').textContent : '';
    const price = card.querySelector('.card-sale-price') ? card.querySelector('.card-sale-price').textContent : '';
    const originalPrice = card.querySelector('.card-original-price') ? card.querySelector('.card-original-price').textContent : '';

    if (qvImage) qvImage.src = img;
    if (qvBadge) qvBadge.textContent = badge;
    if (qvTitle) qvTitle.textContent = title;
    if (qvPrice) qvPrice.textContent = price;
    if (qvOriginalPrice) qvOriginalPrice.textContent = originalPrice;

    quickViewOverlay.classList.add('open');
    quickViewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = () => {
    if (!quickViewModal) return;
    quickViewOverlay.classList.remove('open');
    quickViewModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Attach quick view click to card quick view buttons
  const quickViewBtns = document.querySelectorAll('.card-quick-view-btn');
  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.collection-card');
      openQuickView(card);
    });
  });

  if (quickViewClose) quickViewClose.addEventListener('click', closeQuickView);
  if (quickViewOverlay) quickViewOverlay.addEventListener('click', closeQuickView);

  // Quick View Size Pills Toggle
  const qvSizePills = document.querySelectorAll('.qv-size-pill');
  qvSizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      qvSizePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Quick View Quantity +/- buttons
  const qtyMinus = document.querySelector('.qty-minus');
  const qtyPlus = document.querySelector('.qty-plus');
  const qtyInput = document.querySelector('.qty-input');

  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
    qtyPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      qtyInput.value = val + 1;
    });
  }

  // Quick View Modal Add to Cart
  if (qvAddToCartBtn) {
    qvAddToCartBtn.addEventListener('click', () => {
      const title = qvTitle ? qvTitle.textContent.trim() : 'Luxury Rajputi Poshak';
      const price = qvPrice ? qvPrice.textContent.trim() : '₹18,999';
      const img = qvImage ? qvImage.getAttribute('src') : 'public/photos/image1.png';
      const qtyVal = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

      if (window.KrishnamCart) {
        window.KrishnamCart.addItem({ title, price, img, qty: qtyVal }, true);
      } else {
        updateCartCount();
        showToast(title);
      }
      closeQuickView();
    });
  }
});


  // Filter collections by URL query (?filter=bestsellers / newarrivals / toprated)
  const urlParams = new URLSearchParams(window.location.search);
  const requestedFilter = urlParams.get('filter');
  if (requestedFilter) {
    const allCards = document.querySelectorAll('.collection-card');
    allCards.forEach(c => {
      const cat = c.getAttribute('data-category');
      if (cat === requestedFilter) {
        c.style.display = '';
      } else {
        c.style.display = 'none';
      }
    });

    // Update banner / title text if available
    const pageTitle = document.querySelector('.hero-section h1, .collection-header h1, .page-title');
    if (pageTitle) {
      if (requestedFilter === 'bestsellers') pageTitle.textContent = 'Best Sellers Collection';
      else if (requestedFilter === 'newarrivals') pageTitle.textContent = 'New Arrivals Collection';
      else if (requestedFilter === 'toprated') pageTitle.textContent = 'Top Rated Collection';
    }
  }
