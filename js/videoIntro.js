/**
 * Video intro controller
 */

export class VideoIntroController {
  constructor() {
    this.videoIntro = document.getElementById('videoIntro');
    this.introVideo = document.getElementById('introVideo');
    this.init();
  }

  init() {
    // If intro has been played in this session, remove overlay and skip
    if (sessionStorage.getItem('introPlayed') === 'true') {
      this.videoIntro?.remove();
      document.body.classList.remove('video-playing');
      return;
    }

    if (!this.videoIntro || !this.introVideo) return;

    // Add playing class to body
    document.body.classList.add('video-playing');

    // Set up responsive video sources
    this.setupResponsiveVideo();

    // Handle video end
    this.introVideo.addEventListener('ended', () => {
      this.hideIntro();
    });

    // Fallback: auto-hide after 10 seconds if video doesn't end
    setTimeout(() => {
      if (!this.videoIntro.classList.contains('fade-out')) {
        this.hideIntro();
      }
    }, 6000);
  }

  setupResponsiveVideo() {
    const updateVideoSource = () => {
      const isMobile = window.innerWidth <= 767;
      const videoSrc = isMobile ? 'https://cdn.jsdelivr.net/gh/hanour-design/design-Landing-page-assets@main/mobile.mov' : 'https://cdn.jsdelivr.net/gh/hanour-design/design-Landing-page-assets@main/desktop.mov';
      
      // Only change source if different
      if (this.introVideo.src !== videoSrc) {
        this.introVideo.src = videoSrc;
        this.introVideo.load();
        this.introVideo.play().catch(e => {
          console.log('Video autoplay failed:', e);
          // Auto-hide if autoplay fails
          setTimeout(() => this.hideIntro(), 1000);
        });
      }
    };

    // Set initial source
    updateVideoSource();

    // Update on resize
    window.addEventListener('resize', updateVideoSource);
  }

  hideIntro() {
    // Mark as played for this session
    sessionStorage.setItem('introPlayed', 'true');
    // Ensure page starts at the very top when intro finishes
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    this.videoIntro.classList.add('fade-out');
    document.body.classList.remove('video-playing');
    
    // Remove overlay completely after fade
    setTimeout(() => {
      if (this.videoIntro) {
        this.videoIntro.remove();
      }
    }, 1200);
  }
} 