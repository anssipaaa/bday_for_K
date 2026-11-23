/**
 * Happy Birthday, Kolkol ♡
 * Minimalist & Elegant 2-Page Birthday Book
 * Vanilla JavaScript (Navigation, Lightbox, Subtle Confetti Engine)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- STATE ---
  let currentPage = 1;
  const totalPages = 2;

  // --- DOM ELEMENTS ---
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');
  const btnGoToPage2 = document.getElementById('btnGoToPage2');
  const btnTopBack = document.getElementById('btnTopBack');
  const btnBackToHome = document.getElementById('btnBackToHome');
  const btnTriggerConfetti = document.getElementById('btnTriggerConfetti');

  // Lightbox Elements
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  // Confetti Elements
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let animationFrameId = null;
  let particles = [];

  // =========================================================================
  // PAGE NAVIGATION (EXACTLY 2 PAGES)
  // =========================================================================
  function goToPage(target) {
    if (target === currentPage) return;
    currentPage = target;

    if (currentPage === 1) {
      if (page2) {
        page2.classList.remove('active');
      }
      if (page1) {
        page1.classList.add('active');
      }
      stopConfetti();
    } else if (currentPage === 2) {
      if (page1) {
        page1.classList.remove('active');
      }
      if (page2) {
        page2.classList.add('active');
      }
      // Gentle subtle confetti trigger when opening Page 2
      setTimeout(() => {
        triggerGentleConfetti(45);
      }, 400);
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navigation Event Listeners
  if (btnGoToPage2) {
    btnGoToPage2.addEventListener('click', () => goToPage(2));
  }

  if (btnTopBack) {
    btnTopBack.addEventListener('click', () => goToPage(1));
  }

  if (btnBackToHome) {
    btnBackToHome.addEventListener('click', () => goToPage(1));
  }

  // Keyboard navigation (Arrow keys & Escape)
  document.addEventListener('keydown', (e) => {
    // If modal is open, let Escape close it
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      return;
    }

    if (e.key === 'ArrowRight' && currentPage === 1) {
      goToPage(2);
    } else if (e.key === 'ArrowLeft' && currentPage === 2) {
      goToPage(1);
    }
  });

  // =========================================================================
  // PHOTO LIGHTBOX MODAL
  // =========================================================================
  function openLightbox(imgSrc, captionText) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    if (lightboxCaption) {
      if (captionText && captionText.trim()) {
        lightboxCaption.textContent = captionText;
        lightboxCaption.style.display = 'block';
      } else {
        lightboxCaption.textContent = '';
        lightboxCaption.style.display = 'none';
      }
    }
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const caption = item.querySelector('.caption-text');
      if (img) {
        openLightbox(img.src, caption ? caption.textContent : '');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  // =========================================================================
  // SUBTLE & LIGHTWEIGHT CONFETTI ENGINE (WARM MINIMALIST TONES)
  // =========================================================================
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Palette: Soft Ivory, Champagne Gold, Muted Dusty Rose, Warm Beige
  const confettiColors = [
    '#EADBCE', // beige
    '#CFA69D', // dusty rose
    '#BFA074', // champagne gold
    '#F4EFE6', // cream
    '#DFD2C4', // warm sand
    '#A8988A'  // soft taupe
  ];

  class ConfettiParticle {
    constructor(x, y) {
      this.x = x || Math.random() * (canvas ? canvas.width : 500);
      this.y = y || -15;
      this.size = Math.random() * 6 + 4;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = Math.random() * 1.5 + 1.0;
      this.rotation = Math.random() * 360;
      this.vRot = (Math.random() - 0.5) * 3;
      this.opacity = 1;
      this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.vRot;

      // Slight wind oscillation
      this.vx += Math.sin(this.y * 0.02) * 0.02;

      if (canvas && this.y > canvas.height - 40) {
        this.opacity -= 0.02;
      }
    }

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.globalAlpha = Math.max(0, this.opacity);
      context.fillStyle = this.color;

      if (this.shape === 'rect') {
        context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
      } else {
        context.beginPath();
        context.arc(0, 0, this.size * 0.45, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    }
  }

  function triggerGentleConfetti(count = 40) {
    if (!canvas || !ctx) return;
    resizeCanvas();

    for (let i = 0; i < count; i++) {
      particles.push(new ConfettiParticle());
    }

    if (!animationFrameId) {
      loopConfetti();
    }
  }

  function loopConfetti() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);

      if (p.y > canvas.height || p.opacity <= 0) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(loopConfetti);
    } else {
      animationFrameId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function stopConfetti() {
    particles = [];
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  if (btnTriggerConfetti) {
    btnTriggerConfetti.addEventListener('click', () => {
      triggerGentleConfetti(50);
    });
  }

  // =========================================================================
  // AUTOMATIC IMAGE EXTENSION FALLBACK (.jpeg / .jpg / .png)
  // =========================================================================
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function handleImgError() {
      const src = this.getAttribute('src');
      if (!src) return;

      if (src.endsWith('.jpeg')) {
        this.src = src.replace(/\.jpeg$/, '.jpg');
      } else if (src.endsWith('.jpg')) {
        this.src = src.replace(/\.jpg$/, '.jpeg');
      } else if (src.endsWith('.png')) {
        this.src = src.replace(/\.png$/, '.jpg');
      }
    }, { once: true });
  });

});
