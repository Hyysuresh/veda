/**
 * Hero Slider Component
 * - 3-second auto-play transition
 * - Vertical indicators support
 * - Touch & swipe gestures
 * - Pause on hover
 */

class HeroSlider {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '.hero-section');
    if (!this.container) return;

    this.slides = this.container.querySelectorAll('.hero-slide');
    this.indicators = this.container.querySelectorAll('.vertical-dot, .indicator-dot');
    this.progressBar = this.container.querySelector('.slider-progress-bar');

    this.totalSlides = this.slides.length;
    this.currentIndex = 0;
    this.intervalDuration = options.duration || 3000; // 3 seconds interval
    this.progressInterval = null;
    this.progressStep = 50;
    this.elapsedTime = 0;
    this.isPaused = false;

    // Touch variables
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    if (this.totalSlides === 0) return;

    this.bindEvents();
    this.showSlide(this.currentIndex);
    this.startAutoPlay();
  }

  bindEvents() {
    // Indicator dots click
    this.indicators.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (this.currentIndex !== index) {
          this.showSlide(index);
          this.resetTimer();
        }
      });
    });

    // Pause on hover
    this.container.addEventListener('mouseenter', () => {
      this.isPaused = true;
    });

    this.container.addEventListener('mouseleave', () => {
      this.isPaused = false;
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        this.prevSlide();
        this.resetTimer();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        this.nextSlide();
        this.resetTimer();
      }
    });

    // Touch / Swipe support
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.isPaused = true;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      this.isPaused = false;
    }, { passive: true });
  }

  handleSwipe() {
    const threshold = 40;
    const diff = this.touchStartX - this.touchEndX;

    if (diff > threshold) {
      this.nextSlide();
      this.resetTimer();
    } else if (diff < -threshold) {
      this.prevSlide();
      this.resetTimer();
    }
  }

  showSlide(index) {
    if (index >= this.totalSlides) index = 0;
    if (index < 0) index = this.totalSlides - 1;

    this.currentIndex = index;

    // Update slides
    this.slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update indicators
    this.indicators.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });

    this.elapsedTime = 0;
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }

  nextSlide() {
    this.showSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.showSlide(this.currentIndex - 1);
  }

  startAutoPlay() {
    this.stopAutoPlay();

    this.progressInterval = setInterval(() => {
      if (!this.isPaused) {
        this.elapsedTime += this.progressStep;
        const percentage = Math.min((this.elapsedTime / this.intervalDuration) * 100, 100);

        if (this.progressBar) {
          this.progressBar.style.width = `${percentage}%`;
        }

        if (this.elapsedTime >= this.intervalDuration) {
          this.nextSlide();
        }
      }
    }, this.progressStep);
  }

  stopAutoPlay() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  resetTimer() {
    this.elapsedTime = 0;
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroSlider;
}
