/**
 * Krishnam Poshak - First Time Visitor Subscribe & VIP Mobile Popup
 */

document.addEventListener('DOMContentLoaded', () => {
  const popupOverlay = document.getElementById('subscribePopupOverlay');
  const popupCloseBtn = document.getElementById('subscribePopupClose');
  const subscribeForm = document.getElementById('subscribePopupForm');
  const phoneInput = document.getElementById('subscribePhoneInput');
  const formContainer = document.getElementById('subscribeFormContainer');
  const successContainer = document.getElementById('subscribeSuccessContainer');
  const copyCouponBtn = document.getElementById('copyCouponBtn');
  const couponCodeEl = document.getElementById('couponCode');

  if (!popupOverlay) return;

  const isSubscribed = localStorage.getItem('kp_newsletter_subscribed');
  const isDismissed = sessionStorage.getItem('kp_newsletter_dismissed');

  // Open Popup after 2.5 seconds for first-time visitors
  if (!isSubscribed && !isDismissed) {
    setTimeout(() => {
      openPopup();
    }, 2500);
  }

  function openPopup() {
    popupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popupOverlay.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem('kp_newsletter_dismissed', 'true');
  }

  if (popupCloseBtn) {
    popupCloseBtn.addEventListener('click', closePopup);
  }

  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      closePopup();
    }
  });

  // Handle Form Submission
  if (subscribeForm && phoneInput) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneVal = phoneInput.value.trim().replace(/\D/g, '');

      if (phoneVal.length !== 10) {
        alert('Please enter a valid 10-digit mobile number.');
        phoneInput.focus();
        return;
      }

      // Save VIP mobile subscriber
      localStorage.setItem('kp_newsletter_subscribed', phoneVal);

      // Show Success View
      if (formContainer && successContainer) {
        formContainer.style.display = 'none';
        successContainer.classList.add('show');
      }
    });
  }

  // Copy Coupon Code button
  if (copyCouponBtn && couponCodeEl) {
    copyCouponBtn.addEventListener('click', () => {
      const code = couponCodeEl.textContent.trim();
      navigator.clipboard.writeText(code).then(() => {
        copyCouponBtn.textContent = 'COPIED!';
        copyCouponBtn.style.background = '#2e7d32';
        setTimeout(() => {
          copyCouponBtn.textContent = 'COPY CODE';
          copyCouponBtn.style.background = '';
        }, 2000);
      }).catch(() => {
        copyCouponBtn.textContent = 'COPIED!';
      });
    });
  }
});
