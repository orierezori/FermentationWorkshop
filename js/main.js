// Intersection Observer for fade-up effect
const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
    if (el.isIntersecting) el.target.classList.add('show');
    });
}, { threshold: 0.18 });

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

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
    } else {
        langToggleButton.textContent = 'HE';
        langToggleButton.dataset.langSwitch = 'he';
        langToggleButton.title = 'Switch to Hebrew';
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
}

const preferredLang = localStorage.getItem('preferredLang') || 'he';
setLanguage(preferredLang); 

// Add click event to date list items
const dateListItems = document.querySelectorAll('#dates ul li');
dateListItems.forEach(li => {
  li.style.cursor = 'pointer';
  li.addEventListener('click', function() {
    // Get the Hebrew date text
    const dateText = this.querySelector('span[data-lang="he"]').textContent.trim();
    const message = encodeURIComponent(`היי, אני מעוניין.ת להירשם לסדנה בתאריך ${dateText}`);
    const waUrl = `https://wa.me/31611675802?text=${message}`;
    window.open(waUrl, '_blank');
  });
}); 