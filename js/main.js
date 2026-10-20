/**
 * Main Application Entry Point & Homepage Shop Interactions
 * - Navbar init
 * - Hero Slider init
 * - Back to top button
 * - Live Quick View Modal for ALL Homepage Product Cards (Best Sellers, Trending, Latest)
 * - Working ADD TO CART on all sections
 * - Wishlist Heart Toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Navbar
  const navbar = new Navbar();

  // 2. Initialize Hero Slider
  const heroSlider = new HeroSlider({
    container: '.hero-section',
    duration: 3000
  });

  // 3. Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });
  }

  // 4. Cart State & Toast Management
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

  // 5. Inject / Handle "ADD TO CART" on ALL product cards (Best Sellers, Trending, Latest)
  const productCards = document.querySelectorAll('.product-card, .trending-card, .latest-card');
  productCards.forEach(card => {
    const info = card.querySelector('.product-info, .trending-info, .latest-info');
    if (info && !info.querySelector('.home-add-to-cart-btn')) {
      const btn = document.createElement('button');
      btn.className = 'home-add-to-cart-btn';
      btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> ADD TO CART`;
      info.appendChild(btn);

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const titleEl = card.querySelector('.product-name, .trending-name, .latest-name');
        const priceEl = card.querySelector('.current-price, .trending-current-price, .latest-current-price');
        const imgEl = card.querySelector('.product-img-primary, .trending-img-primary, .latest-img-primary');
        
        const title = titleEl ? titleEl.textContent.trim() : 'Luxury Poshak';
        const price = priceEl ? priceEl.textContent.trim() : '₹18,999';
        const img = imgEl ? imgEl.getAttribute('src') : 'public/photos/image1.png';

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>✓ ADDED</span>';
        btn.style.background = '#2e7d32';

        if (window.KrishnamCart) {
          window.KrishnamCart.addItem({ title, price, img, qty: 1 }, true);
        } else {
          updateCartCount();
          showToast(title);
        }

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
        }, 1500);
      });
    }
  });

  // 6. Action Sidebar Interactions (Wishlist, Compare, Quick View) & Select Options Bar
  const wishlistBtns = document.querySelectorAll('.wishlist-btn, .action-wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      const card = btn.closest('.product-card, .trending-card, .latest-card');
      const title = card ? (card.querySelector('.product-name, .trending-name, .latest-name') || {}).textContent : 'Item';
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
      const card = btn.closest('.product-card, .trending-card, .latest-card');
      const title = card ? (card.querySelector('.product-name, .trending-name, .latest-name') || {}).textContent : 'Item';
      showToast(`Added to Compare: ${title.trim()}`);
    });
  });

  // Action Quick View Buttons (from sidebar)
  const actionQuickViewBtns = document.querySelectorAll('.action-quickview-btn');
  actionQuickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.product-card, .trending-card, .latest-card');
      openQuickView(card);
    });
  });

  // Select Options / Add to Cart Bar Click Handler
  const selectOptionsBars = document.querySelectorAll('.select-options-bar');
  selectOptionsBars.forEach(bar => {
    bar.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = bar.closest('.product-card, .trending-card, .latest-card');
      const titleEl = card ? card.querySelector('.product-name, .trending-name, .latest-name') : null;
      const priceEl = card ? card.querySelector('.current-price, .trending-current-price, .latest-current-price') : null;
      const imgEl = card ? card.querySelector('.product-img-primary, .trending-img-primary, .latest-img-primary') : null;

      const title = titleEl ? titleEl.textContent.trim() : 'Designer Suit';
      const price = priceEl ? priceEl.textContent.trim() : '₹1,890';
      const img = imgEl ? imgEl.getAttribute('src') : 'public/photos/image1.png';

      if (window.KrishnamCart) {
        window.KrishnamCart.addItem({ title, price, img, qty: 1 }, true);
      } else {
        updateCartCount();
        showToast(title);
      }
    });
  });

  // 7. Homepage Quick View Popup Modal Logic
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

    const imgEl = card.querySelector('.product-img-primary, .trending-img-primary, .latest-img-primary');
    const badgeEl = card.querySelector('.product-badge, .trending-badge, .latest-badge');
    const titleEl = card.querySelector('.product-name, .trending-name, .latest-name');
    const priceEl = card.querySelector('.current-price, .trending-current-price, .latest-current-price');
    const originalPriceEl = card.querySelector('.original-price, .trending-original-price, .latest-original-price');

    if (qvImage && imgEl) qvImage.src = imgEl.src;
    if (qvBadge) qvBadge.textContent = badgeEl ? badgeEl.textContent : 'TRENDING';
    if (qvTitle) qvTitle.textContent = titleEl ? titleEl.textContent : 'Luxury Poshak';
    if (qvPrice) qvPrice.textContent = priceEl ? priceEl.textContent : '₹18,999';
    if (qvOriginalPrice) qvOriginalPrice.textContent = originalPriceEl ? originalPriceEl.textContent : '₹24,999';

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

  // Attach quick view click to card quick view overlays across ALL sections
  const quickViewOverlays = document.querySelectorAll('.quick-view-overlay');
  quickViewOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = overlay.closest('.product-card, .trending-card, .latest-card');
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
      const title = qvTitle ? qvTitle.textContent.trim() : 'Luxury Poshak';
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

  // 8. Testimonials Mobile Auto-Slider (1 Review every 3 Seconds)
  const reviewsGrid = document.querySelector('.reviews-grid');
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewsContainer = document.querySelector('.reviews-container');

  if (reviewsGrid && reviewCards.length > 1 && reviewsContainer) {
    let dotsContainer = reviewsContainer.querySelector('.reviews-mobile-dots');
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'reviews-mobile-dots';
      reviewCards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `review-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Review ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToReview(idx);
          restartReviewTimer();
        });
        dotsContainer.appendChild(dot);
      });
      reviewsContainer.appendChild(dotsContainer);
    }

    let currentReview = 0;
    let reviewInterval = null;

    function goToReview(idx) {
      if (window.innerWidth > 768) {
        reviewsGrid.style.transform = '';
        return;
      }
      currentReview = (idx + reviewCards.length) % reviewCards.length;
      reviewsGrid.style.transform = `translateX(-${currentReview * 100}%)`;

      const dots = dotsContainer.querySelectorAll('.review-dot');
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentReview);
      });
    }

    function startReviewTimer() {
      if (reviewInterval) clearInterval(reviewInterval);
      reviewInterval = setInterval(() => {
        if (window.innerWidth <= 768) {
          goToReview(currentReview + 1);
        }
      }, 3000);
    }

    function restartReviewTimer() {
      startReviewTimer();
    }

    startReviewTimer();

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        reviewsGrid.style.transform = '';
      } else {
        goToReview(currentReview);
      }
    });

    // Touch Swipe Support for Mobile Reviews
    let touchStartX = 0;
    let touchEndX = 0;

    reviewsContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    reviewsContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        goToReview(currentReview + 1);
        restartReviewTimer();
      } else if (touchEndX - touchStartX > 45) {
        goToReview(currentReview - 1);
        restartReviewTimer();
      }
    }, { passive: true });
  }
});
