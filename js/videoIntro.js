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

    if (!this.videoIntro || !this.introVideo) {
      console.log('Video intro elements not found');
      return;
    }

    // Add playing class to body
    document.body.classList.add('video-playing');

    // Set up responsive video sources
    this.setupResponsiveVideo();

    // Handle video events
    this.setupVideoEvents();

    // Fallback: auto-hide after 8 seconds if video doesn't work
    this.fallbackTimer = setTimeout(() => {
      if (!this.videoIntro.classList.contains('fade-out')) {
        console.log('Video fallback timeout - hiding intro');
        this.hideIntro();
      }
    }, 8000);
  }

  setupVideoEvents() {
    // Handle video end
    this.introVideo.addEventListener('ended', () => {
      console.log('Video ended');
      this.hideIntro();
    });

    // Handle successful load
    this.introVideo.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully');
    });

    // Handle load errors
    this.introVideo.addEventListener('error', (e) => {
      console.error('Video load error:', e);
      this.hideIntro();
    });

    // Handle play start
    this.introVideo.addEventListener('play', () => {
      console.log('Video started playing');
    });
  }

  setupResponsiveVideo() {
    const updateVideoSource = async () => {
      const isMobile = window.innerWidth <= 767;
      const videoSrc = isMobile 
        ? 'https://cdn.jsdelivr.net/gh/hanour-design/design-Landing-page-assets@main/縦長.mov' 
        : 'https://cdn.jsdelivr.net/gh/hanour-design/design-Landing-page-assets@main/横長.mov';
      
      console.log(`Setting video source: ${videoSrc} (${isMobile ? 'mobile' : 'desktop'})`);
      
      // Only change source if different
      if (this.introVideo.src !== videoSrc) {
        this.introVideo.src = videoSrc;
        this.introVideo.load();
        
        try {
          // Wait a bit for the video to load
          await new Promise(resolve => setTimeout(resolve, 100));
          await this.introVideo.play();
          console.log('Video autoplay successful');
        } catch (e) {
          console.log('Video autoplay failed:', e);
          // Try to play without sound as fallback
          this.introVideo.muted = true;
          try {
            await this.introVideo.play();
            console.log('Video autoplay successful (muted)');
          } catch (e2) {
            console.log('Video autoplay completely failed:', e2);
            // Auto-hide if autoplay fails completely
            setTimeout(() => this.hideIntro(), 1000);
          }
        }
      }
    };

    // Set initial source
    updateVideoSource();

    // Update on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateVideoSource, 100);
    });
  }

  hideIntro() {
    // Clear fallback timer
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
    }

    // Mark as played for this session
    sessionStorage.setItem('introPlayed', 'true');
    
    // Ensure page starts at the very top when intro finishes
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    
    if (this.videoIntro) {
      this.videoIntro.classList.add('fade-out');
    }
    
    document.body.classList.remove('video-playing');
    
    // Remove overlay completely after fade
    setTimeout(() => {
      if (this.videoIntro) {
        this.videoIntro.remove();
      }
    }, 1200);
  }
} 