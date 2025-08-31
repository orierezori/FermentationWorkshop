// Intersection Observer for fade-up effect and lazy loading fallback
const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
    if (el.isIntersecting) {
        el.target.classList.add('show');
        // Lazy loading fallback for browsers that don't support loading="lazy"
        if (el.target.tagName === 'IMG' && el.target.dataset.src) {
            el.target.src = el.target.dataset.src;
            el.target.removeAttribute('data-src');
        }
    }
    });
}, { threshold: 0.18, rootMargin: '50px' });

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// Simple fallback lazy loading for images without native support
if (!('loading' in document.createElement('img'))) {
    // Browser doesn't support native lazy loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        const src = img.src;
        img.src = ''; // Clear src to prevent loading
        img.dataset.src = src; // Store original src
        observer.observe(img); // Observe for intersection
    });
}

// Image error handling for mobile networks
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.warn(`Image failed to load: ${this.src}`);
        // Add error styling
        this.style.backgroundColor = '#ffebee';
        this.style.border = '2px solid #f44336';
        this.alt = this.alt + ' (Image failed to load)';
    });

    img.addEventListener('load', function() {
        // Remove loading background when image loads successfully
        this.style.backgroundColor = '';
    });
});

// Network status detection for mobile optimization
let isOnline = navigator.onLine;
window.addEventListener('online', function() {
    isOnline = true;
    console.log('Connection restored - reloading failed images');
    // Retry loading failed images when connection is restored
    document.querySelectorAll('img[style*="background-color: rgb(255, 235, 238)"]').forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        } else {
            img.src = img.src; // Force reload
        }
    });
});

window.addEventListener('offline', function() {
    isOnline = false;
    console.log('Connection lost');
});

// Language Switcher & CTA
const langToggleButton = document.getElementById('lang-toggle-btn');
const ctaButton = document.querySelector('.navbar a.cta'); // Get the CTA button
const translatableElements = document.querySelectorAll('[data-lang]');
const htmlElement = document.documentElement;
const galleryImages = document.querySelectorAll('.gallery-grid img');

function setLanguage(lang) {
    htmlElement.lang = lang;
    htmlElement.dir = lang === 'he' ? 'rtl' : 'ltr';

    // Set the document title based on language
    if (lang === 'he') {
        document.title = 'סדנת מותססים – חמוצים מותססים בבית';
    } else {
        document.title = 'Fermentation Workshop – Craft Your Own Probiotic Pickles';
    }

    translatableElements.forEach(el => {
    if (el.dataset.lang === lang) {
        el.style.display = ''; 
    } else {
        el.style.display = 'none';
    }
    });
    
    galleryImages.forEach(img => {
    const altHe = img.getAttribute('alt-he');
    const altEn = img.getAttribute('alt-en');
    if (lang === 'he' && altHe) {
        img.alt = altHe;
    } else if (lang === 'en' && altEn) {
        img.alt = altEn;
    } else if (altHe) { 
        img.alt = altHe;
    } else if (altEn) { 
        img.alt = altEn;
    } else {
        img.alt = '';
    }
    });

    // Update the toggle button
    if (langToggleButton) {
    if (lang === 'he') {
        langToggleButton.textContent = 'EN';
        langToggleButton.dataset.langSwitch = 'en';
        langToggleButton.title = 'Switch to English';
        langToggleButton.setAttribute('aria-label', 'Switch to English');
    } else {
        langToggleButton.textContent = 'HE';
        langToggleButton.dataset.langSwitch = 'he';
        langToggleButton.title = 'Switch to Hebrew';
        langToggleButton.setAttribute('aria-label', 'Switch to Hebrew');
    }
    }

    // Show/hide CTA button based on language
    if (ctaButton) {
    if (lang === 'en') {
        ctaButton.classList.add('hidden-lang');
    } else { // lang === 'he'
        ctaButton.classList.remove('hidden-lang');
    }
    }

    localStorage.setItem('preferredLang', lang);
}

if (langToggleButton) {
    langToggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    const langToSwitchTo = e.target.dataset.langSwitch;
    setLanguage(langToSwitchTo);
    });
    // Keyboard accessibility
    langToggleButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const langToSwitchTo = e.target.dataset.langSwitch;
            setLanguage(langToSwitchTo);
        }
    });
}

const preferredLang = localStorage.getItem('preferredLang') || 'he';
setLanguage(preferredLang); 

// Add click and keyboard event to date list items using event delegation
const dateList = document.querySelector('#dates ul');
dateList.addEventListener('click', function(e) {
    let li = e.target.closest('li');
    if (!li || li.getAttribute('aria-disabled') === 'true') return;
    // Get the Hebrew date text, excluding the tag
    const heSpan = li.querySelector('span[data-lang="he"]');
    let dateText = '';
    heSpan.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            dateText += node.textContent.trim();
        }
    });
    dateText = dateText.replace(/\s+/g, ' ').trim();
    const message = encodeURIComponent(`היי, אני מעוניין.ת להירשם לסדנה בתאריך ${dateText}`);
    const waUrl = `https://wa.me/31611675802?text=${message}`;
    window.open(waUrl, '_blank');
});
dateList.addEventListener('keydown', function(e) {
    let li = e.target.closest('li');
    if (!li || li.getAttribute('aria-disabled') === 'true') return;
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
    }
});
// Set aria-disabled and tabindex for full workshops
const dateListItems = document.querySelectorAll('#dates ul li');
dateListItems.forEach(li => {
    if (li.querySelector('.workshop-full-tag')) {
        li.setAttribute('aria-disabled', 'true');
        li.tabIndex = -1;
        li.style.cursor = 'not-allowed';
    } else {
        li.setAttribute('aria-disabled', 'false');
        li.tabIndex = 0;
        li.style.cursor = 'pointer';
    }
});

// Cancellation Policy Modal Logic
const modal = document.getElementById('cancellation-policy-modal');
const openModalBtn = document.getElementById('cancellation-policy-link');
const openModalBtnEn = document.getElementById('cancellation-policy-link-en');
const closeModalBtn = document.getElementById('close-cancellation-modal');
let previouslyFocusedElement = null;

function openModal() {
  if (!modal) return;
  previouslyFocusedElement = document.activeElement;
  modal.style.display = 'block';
  // Set focus to the close button after a short delay to ensure it's visible
  setTimeout(() => {
    if (closeModalBtn) closeModalBtn.focus();
  }, 50); 
  // Apply language-specific display to modal content right before opening
  // This ensures that if language was switched while modal was closed, it opens with correct lang
  const currentLang = htmlElement.lang || 'he';
  const modalTranslatableElements = modal.querySelectorAll('[data-lang]');
  modalTranslatableElements.forEach(el => {
    if (el.dataset.lang === currentLang) {
        el.style.display = ''; 
    } else {
        el.style.display = 'none';
    }
  });
  // Adjust close button title/aria-label based on current language
  if (closeModalBtn) {
    if (currentLang === 'he') {
        closeModalBtn.title = 'סגור';
        closeModalBtn.setAttribute('aria-label', 'סגור חלון מדיניות ביטולים');
    } else {
        closeModalBtn.title = 'Close';
        closeModalBtn.setAttribute('aria-label', 'Close cancellation policy window');
    }
  }
}

function closeModal() {
  if (!modal) return;
  modal.style.display = 'none';
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }
}

if (openModalBtn) {
  openModalBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openModal();
  });
}
if (openModalBtnEn) {
  openModalBtnEn.addEventListener('click', function(e) {
    e.preventDefault();
    openModal();
  });
}
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

window.addEventListener('click', function(event) {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && modal && modal.style.display === 'block') {
    closeModal();
  }
}); 