function updateCoverInfoWidth() {
  const galleryLineEl = document.querySelector('.gallery-line');
  const coverInfo = document.getElementById('cover-info');
  if (galleryLineEl && coverInfo) {
    coverInfo.style.width = galleryLineEl.getBoundingClientRect().width + 'px';
  }
}

// Delay initial update to ensure gallery-line is fully rendered
window.addEventListener('load', function() {
  setTimeout(updateCoverInfoWidth, 100); // 100ms delay; adjust if needed
});

window.addEventListener('resize', updateCoverInfoWidth);
  
