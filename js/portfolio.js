// Portfolio works data and renderer
const works = [
  {
    type: 'image',
    src: 'https://cdn.jsdelivr.net/gh/hanour-design/design-Landing-page-assets@main/Comming Soon.png',
    alt: 'HORYLABEL パッケージデザイン'
  },
  {
    type: 'image',
    src: 'https://cdn.jsdelivr.net/gh/hanour-design/design-Landing-page-assets@main/名称未設定のデザイン (6).png',
    alt: '韓国人向けレストラン予約 IRUTOMO'
  },
  {
    type: 'video',
    src: 'https://i.imgur.com/hC13M4d.mp4',
    alt: 'HANOUR ブランドビジュアル'
  }
];

function renderPortfolio() {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;
  grid.innerHTML = '';

  works.forEach(work => {
    const item = document.createElement('div');
    item.className = 'portfolio-item';

    if (work.type === 'video') {
      const video = document.createElement('video');
      video.src = work.src;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      item.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = work.src;
      img.alt = work.alt;
      item.appendChild(img);
    }

    grid.appendChild(item);
  });
}

// Execute on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPortfolio);
} else {
  renderPortfolio();
} 