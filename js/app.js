/**
 * Main application entry point
 */
import { Navigation } from './navigation.js';
import { VideoIntroController } from './videoIntro.js';
import { AnimationController } from './animations.js';
import { FormController } from './form.js';

class App {
  constructor() {
    this.modules = new Map();
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initModules());
    } else {
      this.initModules();
    }
  }

  /**
   * Initialize all application modules
   */
  initModules() {
    try {
      // Initialize navigation
      this.modules.set('navigation', new Navigation());
      
      // Initialize video intro
      this.modules.set('videoIntro', new VideoIntroController());

      // Initialize animations
      this.modules.set('animations', new AnimationController());
      
      // Initialize form handling
      this.modules.set('form', new FormController());

      console.log('✅ HANOUR: All modules initialized successfully');
    } catch (error) {
      console.error('❌ HANOUR: Error initializing modules:', error);
    }
  }

  /**
   * Get module instance
   */
  getModule(name) {
    return this.modules.get(name);
  }

  /**
   * Destroy the application and clean up
   */
  destroy() {
    this.modules.clear();
  }
}

// Initialize the application
const app = new App();

// Export for global access if needed
window.HANOUR = app; 