/**
 * Navigation and scrolling functionality
 */
import { SELECTORS, ANIMATION_CONFIG, utils } from './utils.js';

export class Navigation {
  constructor() {
    this.header = utils.getElement(SELECTORS.header);
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupHeaderScroll();
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    const anchorLinks = utils.getElements(SELECTORS.anchorLinks);
    
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = utils.getElement(targetId);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // If sections are hidden, reveal instantly when navigating via header
          const delayedSections = document.querySelectorAll('.delayed-section');
          delayedSections.forEach(sec => sec.classList.add('visible'));
        }
      });
    });
  }

  /**
   * Setup header background change on scroll
   */
  setupHeaderScroll() {
    if (!this.header) return;

    const handleScroll = utils.debounce(() => {
      if (window.scrollY > ANIMATION_CONFIG.scrollThreshold) {
        this.header.style.background = 'rgba(9, 1, 1, 0.98)';
      } else {
        this.header.style.background = 'rgba(9, 1, 1, 0.95)';
      }
    }, 10);

    window.addEventListener('scroll', handleScroll);
  }
} 

/**
 * Puzzle Slider for Work page navigation
 */
function initPuzzleSlider() {
  const slider = document.querySelector('.puzzle-slider');
  if (!slider) return;

  const handle = slider.querySelector('.puzzle-slider__handle');
  const target = slider.querySelector('.puzzle-slider__target');
  const track = slider.querySelector('.puzzle-slider__track');
  
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let initialTransform = 0;

  // ドラッグ開始（Pointer Events で統一）
  handle.addEventListener('pointerdown', startDrag);

  function startDrag(e) {
    // 動画イントロ中は無効化
    if (document.body.classList.contains('video-playing')) {
      return;
    }

    isDragging = true;
    handle.classList.add('dragging');
    
    // キャプチャ位置
    const clientX = e.clientX;
    startX = clientX;
    
    const transform = getComputedStyle(handle).transform;
    if (transform !== 'none') {
      const matrix = new DOMMatrix(transform);
      initialTransform = matrix.m41;
    } else {
      initialTransform = 0;
    }

    document.addEventListener('pointermove', drag);
    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);
  }

  function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = e.clientX;
    currentX = clientX - startX;
    
    // 制限範囲を計算（左端から右端まで）
    const maxMove = track.offsetWidth - handle.offsetWidth - 4; // 4px = border offset
    const clampedX = Math.max(0, Math.min(maxMove, initialTransform + currentX));
    
    handle.style.transform = `translateX(${clampedX}px)`;
    
    // ターゲットエリアに近づいたらハイライト
    const targetDistance = Math.abs(clampedX - (maxMove - 40)); // 40px tolerance
    if (targetDistance < 20) {
      target.classList.add('active');
    } else {
      target.classList.remove('active');
    }
  }

  function endDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    handle.classList.remove('dragging');
    
    const maxMove = track.offsetWidth - handle.offsetWidth - 4;
    const currentTransform = getCurrentTransform();
    
    // 成功判定（右端近くまで到達）
    if (currentTransform > maxMove - 30) {
      // 成功アニメーション
      handle.classList.add('success');
      target.classList.add('active');
      handle.style.transform = `translateX(${maxMove}px)`;
      
      setTimeout(() => {
        window.location.href = 'we-work.html';
      }, 600);
    } else {
      // 失敗時は元の位置に戻る
      handle.style.transform = 'translateX(0px)';
      target.classList.remove('active');
    }
    
    document.removeEventListener('pointermove', drag);
    document.removeEventListener('pointerup', endDrag);
    document.removeEventListener('pointercancel', endDrag);
  }

  function getCurrentTransform() {
    const transform = getComputedStyle(handle).transform;
    if (transform === 'none') return 0;
    const matrix = new DOMMatrix(transform);
    return matrix.m41;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initPuzzleSlider();
}); 