# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for a fermentation workshop ("סדנת מותססים") that teaches people how to make probiotic pickles at home. The site is bilingual (Hebrew/English) with RTL/LTR support and includes progressive web app functionality.

## Architecture

The project is a client-side only static website with:

- **HTML**: Single page application (`index.html`) with bilingual content using `data-lang` attributes
- **CSS**: Responsive design with mobile-first approach (`css/style.css`)
- **JavaScript**: Language switching, accessibility features, and modal functionality (`js/main.js`)
- **Assets**: Workshop images, logo, and PWA manifest

### Key Features

- **Bilingual Support**: Hebrew (RTL) and English (LTR) with language preference stored in localStorage
- **Progressive Web App**: Installable with `manifest.json`
- **Accessibility**: Skip links, ARIA attributes, keyboard navigation, focus management
- **Responsive Design**: Mobile-first CSS with tablet (768px+) and desktop (1161px+) breakpoints
- **Interactive Elements**: Workshop date selection with WhatsApp integration, cancellation policy modal

## Development

This is a static website with no build process required. Simply open `index.html` in a browser or serve with any static file server.

### Local Development

```bash
# Serve locally using Python
python3 -m http.server 8000
# or using Node.js
npx serve .
```

### File Structure

```
/
├── index.html           # Main HTML file with bilingual content
├── manifest.json        # PWA manifest
├── css/
│   └── style.css       # All styles with mobile-first responsive design
├── js/
│   └── main.js         # Language switching, modals, accessibility
├── logo_mutsasim.png   # Brand logo
└── workshop1-9.jpeg    # Gallery images
```

### Language System

- Hebrew is the default language (`lang="he" dir="rtl"`)
- All translatable content uses `data-lang="he"` and `data-lang="en"` attributes
- Language preference is persisted in `localStorage`
- Images have language-specific alt text via `alt-he` and `alt-en` attributes

### Workshop Date System

- Date items in the `#dates` section are clickable/keyboard accessible
- Full workshops have `.workshop-full-tag` and are disabled via `aria-disabled="true"`
- Clicking dates opens WhatsApp with pre-filled Hebrew registration message
- Date text is extracted excluding status tags for the WhatsApp message

### Modal System

- Cancellation policy modal with focus management
- Language-aware content switching
- Keyboard navigation (Escape to close)
- Focus returns to trigger element on close

### CSS Architecture

- CSS custom properties (variables) for theming
- Mobile-first responsive design with two main breakpoints
- Utility classes for accessibility (`.visually-hidden`, `.skip-link`)
- Component-based organization (navbar, hero, gallery, etc.)

### Accessibility Features

- Skip link for keyboard navigation
- Proper focus management in modals
- ARIA attributes for interactive elements
- Sufficient touch targets (48px minimum)
- Color contrast compliance
- RTL/LTR directional support