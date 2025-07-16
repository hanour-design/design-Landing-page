/**
 * Form handling functionality
 */
import { SELECTORS, utils } from './utils.js';

export class FormController {
  constructor() {
    this.form = utils.getElement(SELECTORS.contactForm);
    this.init();
  }

  init() {
    if (!this.form) return;
    this.setupFormSubmission();
  }

  /**
   * Setup form submission handling
   */
  setupFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    if (!this.validateForm()) return;

    const formData = new FormData(this.form);

    try {
      const response = await fetch('https://formspree.io/f/xgvyjbkg', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (response.ok) {
        this.showSuccessMessage();
        this.form.reset();
      } else {
        this.showErrorMessage();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage();
    }
  }

  /**
   * Show success message to user
   */
  showSuccessMessage() {
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('successModalClose');

    if (!modal) return;

    modal.classList.add('modal--visible');

    const hide = () => {
      modal.classList.remove('modal--visible');
      closeBtn?.removeEventListener('click', hide);
    };

    // 自動的に5秒後に閉じる
    const autoTimer = setTimeout(hide, 5000);

    // 閉じるボタン
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        clearTimeout(autoTimer);
        hide();
      }, { once: true });
    }
  }

  /**
   * Show error message
   */
  showErrorMessage() {
    alert('送信中にエラーが発生しました。時間を置いて再度お試しください。');
  }

  /**
   * Validate form data (can be extended)
   */
  validateForm() {
    // Add validation logic here if needed
    return true;
  }
} 