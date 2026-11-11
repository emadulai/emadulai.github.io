/**
 * ============================================================================
 * EmadulAi — Centralized Tool Registry (Single Source of Truth)
 * ============================================================================
 * 
 * HOW TO ADD A NEW TOOL IN 3 SIMPLE STEPS:
 * 
 * 1. Build your individual tool HTML file (e.g. `word-counter.html` or `pages/word-counter.html`).
 * 2. Add an object to the `EMADULAI_TOOLS` array below with the required fields:
 *    - `id`: unique identifier string (e.g., 'word-counter')
 *    - `name`: user-facing display name (e.g., 'Word Counter')
 *    - `description`: concise explanation of functionality
 *    - `category`: must match one of the standard categories defined in `TOOL_CATEGORIES`
 *    - `icon`: SVG icon key corresponding to `TOOL_ICONS`
 *    - `url`: relative path to the HTML file (e.g., '/word-counter.html')
 *    - `featured`: boolean (true displays it in the Featured section)
 *    - `popular`: boolean (true displays it in Popular tools)
 *    - `status`: 'available' | 'coming-soon'
 *    - `tags`: array of search keywords
 *    - `dateAdded`: 'YYYY-MM-DD'
 * 3. Commit and push to GitHub. The homepage, search, filters, and categories 
 *    will automatically populate without changing any HTML.
 * ============================================================================
 */

const TOOL_CATEGORIES = [
  "Image Tools",
  "PDF Tools",
  "Video Tools",
  "Audio Tools",
  "Text Tools",
  "Developer Tools",
  "SEO Tools",
  "Social Media Tools",
  "File Tools",
  "Converter Tools",
  "Generators",
  "Calculators",
  "Security Tools",
  "Design Tools",
  "Utility Tools"
];

const TOOL_ICONS = {
  image: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  pdf: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-6 4h4"/></svg>`,
  code: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
  text: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>`,
  lock: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
  qr: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>`,
  palette: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4 4.5 4.5 0 014-4.5c.34 0 .67.04 1 .11V6a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2h-1a2 2 0 00-2 2v2a3 3 0 01-3 3H7z"/></svg>`,
  calc: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`,
  tool: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
};

const EMADULAI_TOOLS = [
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert JPG, PNG, and WEBP formats directly in your browser with complete privacy.",
    category: "Image Tools",
    icon: "image",
    url: "/image-converter.html",
    featured: true,
    popular: true,
    status: "available",
    tags: ["image", "jpg", "png", "webp", "photo", "converter"],
    dateAdded: "2026-10-15"
  },
  {
    id: "word-counter",
    name: "Word & Character Counter",
    description: "Calculate real-time word count, character count, reading time, and sentence analysis.",
    category: "Text Tools",
    icon: "text",
    url: "/word-counter.html",
    featured: true,
    popular: true,
    status: "available",
    tags: ["text", "words", "characters", "analysis", "reading time"],
    dateAdded: "2026-11-01"
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Instantly create high-resolution custom QR codes for URLs, text, and contact cards.",
    category: "Generators",
    icon: "qr",
    url: "/qr-code-generator.html",
    featured: true,
    popular: true,
    status: "available",
    tags: ["qr", "generator", "link", "barcode", "matrix"],
    dateAdded: "2026-11-05"
  },
  {
    id: "password-generator",
    name: "Secure Password Generator",
    description: "Generate cryptographically secure, randomized passwords with custom entropy options.",
    category: "Security Tools",
    icon: "lock",
    url: "/password-generator.html",
    featured: false,
    popular: true,
    status: "available",
    tags: ["password", "security", "generator", "crypto", "safe"],
    dateAdded: "2026-11-08"
  },
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    description: "Beautify, inspect, and validate JSON data structures with clean indentation.",
    category: "Developer Tools",
    icon: "code",
    url: "/json-formatter.html",
    featured: true,
    popular: false,
    status: "available",
    tags: ["json", "developer", "format", "beautify", "lint"],
    dateAdded: "2026-11-10"
  },
  {
    id: "color-picker",
    name: "Color Palette & Converter",
    description: "Extract color codes, convert between HEX, RGB, and HSL, and generate harmonies.",
    category: "Design Tools",
    icon: "palette",
    url: "/color-picker.html",
    featured: false,
    popular: false,
    status: "coming-soon",
    tags: ["color", "hex", "rgb", "hsl", "design", "picker"],
    dateAdded: "2026-11-11"
  },
  {
    id: "pdf-tools",
    name: "PDF Suite",
    description: "Fast in-browser PDF merging, page splitting, and lightweight compression utility.",
    category: "PDF Tools",
    icon: "pdf",
    url: "/pdf-tools.html",
    featured: false,
    popular: false,
    status: "coming-soon",
    tags: ["pdf", "documents", "merge", "split", "viewer"],
    dateAdded: "2026-11-11"
  }
];

// Read-only export for global scripts
window.EmadulAi = window.EmadulAi || {};
window.EmadulAi.categories = TOOL_CATEGORIES;
window.EmadulAi.icons = TOOL_ICONS;
window.EmadulAi.tools = EMADULAI_TOOLS;
