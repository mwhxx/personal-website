new p5(function(p) {
    let coverImg;
    let baseRectY, currentRectY, targetRectY;
    
    p.preload = function() {
      coverImg = p.loadImage("/images/artworkicon/cover.png");
    };
    
    p.setup = function() {
      const container = document.getElementById('sketch-container');
      let cnv = p.createCanvas(container.offsetWidth, container.offsetHeight);
      cnv.parent('sketch-container');
      cnv.style('position', 'absolute');
      cnv.style('top', '0');
      cnv.style('left', '0');
      
      // Set the base Y position of the rectangle (adjust as needed)
      baseRectY = (p.height + 450) / 2;
      currentRectY = baseRectY;
      targetRectY = baseRectY;
    };
    
    p.draw = function() {
      p.clear();
      let ctx = p.drawingContext;
      
      // Get the gallery-line element's left position to align the cover rectangle
      const galleryLineEl = document.querySelector('.gallery-line');
      let rectX = 0;
      if (galleryLineEl) {
        rectX = galleryLineEl.getBoundingClientRect().left;
      } else {
        // Fallback: use main's left padding
        const mainEl = document.querySelector('main');
        rectX = parseInt(window.getComputedStyle(mainEl).paddingLeft, 10);
      }
      
      const rectWidth = 400;
      const rectHeight = 230;
      
      // Define image offsets and scaled dimensions
      const imageOffsetX = 0;
      const imageOffsetY = -168;
      const scaledWidth = coverImg.width * 0.15;
      const scaledHeight = coverImg.height * 0.15;
      
      // Check if mouse is in the top 40% of the rectangle (using baseRectY for reference)
      const isMouseInTop = p.mouseX >= rectX && p.mouseX <= rectX + rectWidth &&
                           p.mouseY >= baseRectY && p.mouseY <= baseRectY + rectHeight * 0.4;
      if (isMouseInTop) {
        targetRectY = baseRectY - 70;
        p.cursor('pointer');
      } else {
        targetRectY = baseRectY;
        p.cursor('default');
      }
      
      // Smoothly animate the rectangle's Y position
      currentRectY = p.lerp(currentRectY, targetRectY, 0.1);
      
      // Draw the white background rectangle at currentRectY
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.fillRect(rectX, currentRectY, rectWidth, rectHeight);
      ctx.restore();
      
      // Set up the clipping region matching the rectangle
      ctx.save();
      ctx.beginPath();
      ctx.rect(rectX, currentRectY, rectWidth, rectHeight);
      ctx.clip();
      
      // Draw the image inside the clipping region with offsets
      p.image(coverImg, rectX + imageOffsetX, currentRectY + imageOffsetY, scaledWidth, scaledHeight);
      ctx.restore();
    };
    
    // Mouse click: if clicking in the top 50% of the rectangle, open the link
    p.mouseClicked = function() {
      const galleryLineEl = document.querySelector('.gallery-line');
      let rectX = 0;
      if (galleryLineEl) {
        rectX = galleryLineEl.getBoundingClientRect().left;
      } else {
        const mainEl = document.querySelector('main');
        rectX = parseInt(window.getComputedStyle(mainEl).paddingLeft, 10);
      }
      
      const rectWidth = 400;
      const rectHeight = 230;
      
      if (
        p.mouseX >= rectX && p.mouseX <= rectX + rectWidth &&
        p.mouseY >= currentRectY && p.mouseY <= currentRectY + rectHeight * 0.5
      ) {
        window.open("https://drive.google.com/file/d/1PukzuN107fTwrYQG_Xov8eBOhLRaOfT0/view", "_blank");
      }
    };
  });

  