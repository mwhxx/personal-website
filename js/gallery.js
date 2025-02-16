// 1) Update main padding for the gallery
function updateMainPadding() {
  const ww = window.innerWidth;
  let sidePadding;
  if (ww >= 1728 * 0.65) {
    sidePadding = 150;
  } else if (ww >= 1728 * 0.4) {
    sidePadding = 100;
  } else if (ww >= 1728 * 0.2) {
    sidePadding = 50;
  } else {
    sidePadding = 20;
  }
  document.querySelector('main').style.padding = `0 ${sidePadding}px`;
}

// 2) Update gallery layout (grid and gallery-line positions)
function updateGalleryLayout() {
  const mainEl = document.querySelector('main');
  const availableWidth = mainEl.clientWidth;
  
  // Baseline widths based on fixed image and gap sizes
  const baseWidth4 = 4 * 280 + 3 * 70;
  const baseWidth3 = 3 * 280 + 2 * 70;
  const baseWidth2 = 2 * 280 + 70;
  
  let columns, scale;
  const ww = window.innerWidth;
  if (ww >= 1728 * 0.65) {
    columns = 4;
    scale = availableWidth >= baseWidth4 ? 1 : availableWidth / baseWidth4;
  } else if (ww >= 1728 * 0.4) {
    columns = 3;
    scale = availableWidth >= baseWidth3 ? 1 : availableWidth / baseWidth3;
  } else {
    columns = 2;
    scale = availableWidth >= baseWidth2 ? 1 : availableWidth / baseWidth2;
  }
  
  // Optionally hide placeholder items if columns < 4
  document.querySelectorAll('.hidden-when-not-4').forEach(ph => {
    ph.style.display = (columns < 4) ? 'none' : '';
  });
  
  // Update each photo-gallery grid using CSS custom properties
  const galleries = document.querySelectorAll('.photo-gallery');
  galleries.forEach(gallery => {
    const newImgWidth = 280 * scale;
    const newGap = 70 * scale;
    gallery.style.setProperty('--imgWidth', `${newImgWidth}px`);
    gallery.style.setProperty('--imgGap', `${newGap}px`);
    gallery.style.gridTemplateColumns = `repeat(${columns}, var(--imgWidth))`;
  });
  
  // Update gallery-line positions based on the first row images
  const lines = document.querySelectorAll('.gallery-line');
  galleries.forEach((gallery, idx) => {
    const galleryLine = lines[idx];
    if (galleryLine) {
      const images = gallery.querySelectorAll('.photo-item img');
      if (images.length > 0) {
        const firstRect = images[0].getBoundingClientRect();
        const lastRect = images[Math.min(columns - 1, images.length - 1)].getBoundingClientRect();
        const rowWidth = lastRect.right - firstRect.left;
        galleryLine.style.width = `${rowWidth}px`;
  
        const galleryRect = gallery.getBoundingClientRect();
        galleryLine.style.marginLeft = `${firstRect.left - galleryRect.left}px`;
      }
    }
  });
}

// 3) Update the common left offset used by cover.js and #cover-info
function updateCommonOffset() {
  const galleryLineEl = document.querySelector('.gallery-line');
  let offset = 0;
  if (galleryLineEl) {
    // Use the gallery-line's left coordinate (relative to the viewport)
    offset = galleryLineEl.getBoundingClientRect().left;
  } else {
    const mainEl = document.querySelector('main');
    offset = parseInt(window.getComputedStyle(mainEl).paddingLeft, 10);
  }
  // Save the offset in a CSS variable for use in cover.js
  document.documentElement.style.setProperty('--common-offset', `${offset}px`);
  
  // Also update #cover-info's left margin so it aligns properly
  const coverInfo = document.getElementById('cover-info');
  if (coverInfo) {
    coverInfo.style.marginLeft = `${offset}px`;
  }
}

// 4) Update the social media block's max width so it does not exceed the gallery-line's right end
function updateSocialMediaWidth() {
  const galleryLineEl = document.querySelector('.gallery-line');
  const socialMediaEl = document.querySelector('.social-media');
  if (galleryLineEl && socialMediaEl) {
    const galleryRect = galleryLineEl.getBoundingClientRect();
    const socialRect = socialMediaEl.getBoundingClientRect();
    // Calculate available width from social-media's left to the right edge of gallery-line
    const availableWidth = galleryRect.right - socialRect.left;
    socialMediaEl.style.maxWidth = availableWidth + 'px';
  }
}

// 5) Unified update function
function updateLayout() {
  updateMainPadding();
  updateGalleryLayout();
  updateCommonOffset();
  updateSocialMediaWidth();
}


// 6) Listen for window load and resize events
window.addEventListener('load', updateLayout);
window.addEventListener('resize', updateLayout);

// 7) Resume button click event remains unchanged
document.querySelector('.top-button').addEventListener('click', function () {
  window.open(
    'https://drive.google.com/file/d/10lPcpEV1uVr3gQ2FALNyolFzHMI2vbjj/view?usp=sharing',
    '_blank'
  );
});