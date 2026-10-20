/**
 * Navbar Interactions (Sticky behavior, mobile menu & dropdown toggle)
 */

class Navbar {
  constructor() {
    this.navWrapper = document.querySelector('.luxury-nav-wrapper');
    this.toggleBtn = document.querySelector('.nav-toggle');
    this.navMenuBar = document.querySelector('.nav-menu-bar');
    this.navOverlay = document.querySelector('.mobile-nav-overlay');
    this.closeBtn = document.querySelector('.mobile-drawer-close');
    this.navItemsWithDropdown = document.querySelectorAll('.nav-item.has-dropdown');

    this.init();
  }

  init() {
    if (!this.navWrapper) return;

    this.bindEvents();
  }

  openDrawer() {
    if (this.toggleBtn) this.toggleBtn.classList.add('open');
    if (this.navMenuBar) this.navMenuBar.classList.add('open');
    if (this.navOverlay) this.navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeDrawer() {
    if (this.toggleBtn) this.toggleBtn.classList.remove('open');
    if (this.navMenuBar) this.navMenuBar.classList.remove('open');
    if (this.navOverlay) this.navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = this.navMenuBar && this.navMenuBar.classList.contains('open');
        if (isOpen) {
          this.closeDrawer();
        } else {
          this.openDrawer();
        }
      });
    }

    // Close button inside drawer
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeDrawer();
      });
    }

    // Overlay click closes drawer
    if (this.navOverlay) {
      this.navOverlay.addEventListener('click', () => {
        this.closeDrawer();
      });
    }

    // Mobile dropdown click expand / accordion
    this.navItemsWithDropdown.forEach(item => {
      const link = item.querySelector('.nav-link');
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 960) {
            e.preventDefault();
            e.stopPropagation();
            const wasOpen = item.classList.contains('open-mobile');
            // Close other open accordions
            this.navItemsWithDropdown.forEach(other => {
              if (other !== item) other.classList.remove('open-mobile');
            });
            item.classList.toggle('open-mobile', !wasOpen);
          }
        });
      }
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (this.navMenuBar && this.navMenuBar.classList.contains('open')) {
        if (!this.navMenuBar.contains(e.target) && this.toggleBtn && !this.toggleBtn.contains(e.target)) {
          this.closeDrawer();
        }
      }
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navbar;
}
