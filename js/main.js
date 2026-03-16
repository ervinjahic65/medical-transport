// Preloader
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 800);
});

// Dynamic copyright year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    header.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }

  lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

mobileMenuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  mobileMenuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.getElementById('header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      navMenu.classList.remove('active');
      mobileMenuBtn.textContent = '☰';
    }
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .gallery-item, .testimonial-card').forEach(el => {
  observer.observe(el);
});

// Load More Gallery
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-hidden').forEach(item => {
      item.classList.remove('gallery-hidden');
      item.style.animation = 'fadeInUp 0.5s ease';
    });
    loadMoreBtn.disabled = true;
  });
}

// Load More Testimonials
const loadMoreTestimonialsBtn = document.getElementById('loadMoreTestimonialsBtn');
if (loadMoreTestimonialsBtn) {
  loadMoreTestimonialsBtn.addEventListener('click', () => {
    document.querySelectorAll('.testimonial-hidden').forEach(item => {
      item.classList.remove('testimonial-hidden');
      item.style.animation = 'fadeInUp 0.5s ease';
    });
    loadMoreTestimonialsBtn.disabled = true;
  });
}

// Dynamic review dates in Bosnian
function bosnianRelativeTime(dateStr) {
  const now = new Date();
  const past = new Date(dateStr);
  const diffDays = Math.floor((now - past) / 86400000);
  if (diffDays === 0) return 'danas';
  if (diffDays === 1) return 'jučer';
  if (diffDays < 7) return `prije ${diffDays} dana`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return diffWeeks === 1 ? 'prije jedne sedmice' : `prije ${diffWeeks} sedmice`;
  const diffMonths = Math.round(diffDays / 30.44);
  if (diffMonths < 12) {
    if (diffMonths === 1) return 'prije jednog mjeseca';
    if (diffMonths < 5) return `prije ${diffMonths} mjeseca`;
    return `prije ${diffMonths} mjeseci`;
  }
  const diffYears = Math.round(diffDays / 365.25);
  if (diffYears === 1) return 'prije jedne godine';
  if (diffYears < 5) return `prije ${diffYears} godine`;
  return `prije ${diffYears} godina`;
}
document.querySelectorAll('.review-date[data-date]').forEach(el => {
  el.textContent = bosnianRelativeTime(el.dataset.date);
});

// Lightbox Gallery
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
let currentIndex = 0;

function getGalleryImages() {
  return Array.from(document.querySelectorAll('.gallery-item img'));
}

function openLightbox(index) {
  const imgs = getGalleryImages();
  currentIndex = index;
  lightboxImg.src = imgs[index].src;
  lightboxImg.alt = imgs[index].alt;
  lightboxCounter.textContent = `${index + 1} / ${imgs.length}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  const imgs = getGalleryImages();
  currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = imgs[currentIndex].src;
    lightboxImg.alt = imgs[currentIndex].alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${imgs.length}`;
    lightboxImg.style.opacity = '1';
  }, 150);
}

function showNext() {
  const imgs = getGalleryImages();
  currentIndex = (currentIndex + 1) % imgs.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = imgs[currentIndex].src;
    lightboxImg.alt = imgs[currentIndex].alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${imgs.length}`;
    lightboxImg.style.opacity = '1';
  }, 150);
}

// Event delegation — works for hidden-then-revealed items too
document.querySelector('.gallery-grid').addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (!item) return;
  const imgs = getGalleryImages();
  const clickedImg = item.querySelector('img');
  const index = imgs.indexOf(clickedImg);
  if (index !== -1) openLightbox(index);
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', showPrev);
document.getElementById('lightboxNext').addEventListener('click', showNext);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Touch swipe support
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? showNext() : showPrev();
  }
}, { passive: true });
