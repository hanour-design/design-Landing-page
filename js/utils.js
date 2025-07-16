/**
 * Utility functions and constants
 */

// DOM selectors
export const SELECTORS = {
  header: 'header',
  fadeIn: '.fade-in',
  contactForm: '.contact__form',
  sectionAnim: '#sectionAnim',
  sections: 'section',
  anchorLinks: 'a[href^="#"]'
};

// Animation constants
export const ANIMATION_CONFIG = {
  scrollThreshold: 100,
  intersectionThreshold: 0.15,
  logoThreshold: 0.4,
  rootMargin: '0px 0px -50px 0px'
};

// Utility functions
export const utils = {
  /**
   * Debounce function to limit execution frequency
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Check if element exists in DOM
   */
  elementExists(selector) {
    return document.querySelector(selector) !== null;
  },

  /**
   * Get all elements matching selector
   */
  getElements(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * Get single element
   */
  getElement(selector) {
    return document.querySelector(selector);
  }
}; 