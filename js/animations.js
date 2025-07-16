/**
 * Animation controllers
 */
import { SELECTORS, ANIMATION_CONFIG, utils } from './utils.js';

export class AnimationController {
  constructor() {
    this.logoAnim = utils.getElement(SELECTORS.sectionAnim);
    this.init();
  }

  init() {
    this.setupFadeInAnimations();
    this.setupLogoAnimations();
    this.setupFeatureFlowAnimations();
  }

  /**
   * Setup fade-in animations using Intersection Observer
   */
  setupFadeInAnimations() {
    const observerOptions = {
      threshold: ANIMATION_CONFIG.intersectionThreshold,
      rootMargin: ANIMATION_CONFIG.rootMargin
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const fadeElements = utils.getElements(SELECTORS.fadeIn);
    fadeElements.forEach(el => observer.observe(el));
  }

  /**
   * Setup logo overlay animations
   */
  setupLogoAnimations() {
    if (!this.logoAnim) return;

    const sections = utils.getElements(SELECTORS.sections);
    
    const logoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleSectionChange(entry.target);
        }
      });
    }, { threshold: ANIMATION_CONFIG.logoThreshold });

    sections.forEach(section => logoObserver.observe(section));
  }

  /**
   * Handle section change for logo animation
   */
  handleSectionChange(section) {
    if (section.id === 'contact') {
      // Hide overlay during form section
      this.logoAnim.classList.remove('show');
      this.logoAnim.style.opacity = '0';
    } else {
      // Show and restart animation
      this.logoAnim.style.opacity = '';
      this.logoAnim.classList.remove('show');
      // Force reflow to restart animation
      void this.logoAnim.offsetWidth;
      this.logoAnim.classList.add('show');
    }
  }

  /**
   * Sequential flow-in animations for feature blocks
   */
  setupFeatureFlowAnimations() {
    const section = document.querySelector('#our-creative');
    if (!section) return;

    const featureItems = section.querySelectorAll('.feature-item');
    if (!featureItems.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let cumulative = 0;
          featureItems.forEach((item, index) => {
            const delay = 1200 + Math.random() * 800; // 1.2 – 2s で不規則
            const isLast = index === featureItems.length - 1;
            setTimeout(() => {
              item.classList.add('visible');
              if (isLast) {
                const delayedSections = document.querySelectorAll('.delayed-section');
                delayedSections.forEach(sec => sec.classList.add('visible'));
              }
            }, cumulative);
            cumulative += delay;
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: ANIMATION_CONFIG.intersectionThreshold });

    observer.observe(section);
  }
} 