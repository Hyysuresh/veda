/**
 * Krishnam Poshak - Contact Page Interactivity
 * - FAQ Accordion toggle
 * - Form Submission with Validation & Royal Success Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Navbar if present
  if (typeof Navbar !== 'undefined') {
    new Navbar();
  }

  // 2. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 3. Contact Form Submission
  const contactForm = document.getElementById('royalContactForm');
  const formSuccess = document.getElementById('contactFormSuccess');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (contactForm && formSuccess && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>SENDING INQUIRY...</span>';

      setTimeout(() => {
        submitBtn.innerHTML = '<span>✓ INQUIRY SENT</span>';
        submitBtn.style.background = '#2e7d32';
        formSuccess.classList.add('show');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
        }, 3000);
      }, 1000);
    });
  }
});
