const fs = require('fs');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');
const hljs = require('highlight.js');

// Configuration
const DOCS_DIR = path.join(__dirname, '../docs');
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');

// Configure Marked with Highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-'
});

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR);
}

// Read Template
const template = fs.readFileSync(path.join(SRC_DIR, 'template.html'), 'utf8');
const styles = fs.readFileSync(path.join(SRC_DIR, 'styles.css'), 'utf8');

// Copy Styles and Scripts
fs.writeFileSync(path.join(DIST_DIR, 'styles.css'), styles);
fs.copyFileSync(path.join(SRC_DIR, 'search.js'), path.join(DIST_DIR, 'search.js'));
fs.copyFileSync(path.join(SRC_DIR, 'ai-assistant.js'), path.join(DIST_DIR, 'ai-assistant.js'));
fs.copyFileSync(path.join(SRC_DIR, 'mobile-menu.js'), path.join(DIST_DIR, 'mobile-menu.js'));
fs.copyFileSync(path.join(SRC_DIR, 'demos.js'), path.join(DIST_DIR, 'demos.js'));

// Get all MD files
const files = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.md'));

// Define Group Order Globally
const groupOrder = [
  "Getting Started",
  "Core Concepts",
  "Build Guide: AI Extension",
  "Advanced",
  "Other"
];

// Helper to get group index
const getGroupIndex = (group) => {
  const index = groupOrder.indexOf(group);
  return index === -1 ? 999 : index;
};

// Parse all files to get metadata
const pages = files.map(file => {
  const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
  const { attributes, body } = frontMatter(content);
  return {
    filename: file,
    slug: file.replace('.md', '.html'),
    ...attributes,
    body
  };
}).sort((a, b) => {
  // Primary Sort: Group Order
  const groupA = getGroupIndex(a.group || 'Other');
  const groupB = getGroupIndex(b.group || 'Other');
  if (groupA !== groupB) return groupA - groupB;
  
  // Secondary Sort: Explicit Order
  return a.order - b.order;
});

// Group pages for Sidebar
const groups = {};
pages.forEach(page => {
  const group = page.group || 'Other';
  if (!groups[group]) groups[group] = [];
  groups[group].push(page);
});

// Generate Sidebar HTML
function generateSidebar(currentSlug) {
  // Use the pre-sorted groups based on pages order? 
  // Actually, since we sorted pages, the groups object keys insertion order might not be guaranteed in all JS engines (though mostly is).
  // Let's stick to explicit sorting for safety.
  
  const sortedGroups = Object.entries(groups).sort((a, b) => {
     return getGroupIndex(a[0]) - getGroupIndex(b[0]);
  });


  let html = '';
  for (const [groupName, groupPages] of sortedGroups) {
    html += `<div class="sidebar-group">
      <div class="sidebar-group-title">${groupName}</div>
      ${groupPages.map(page => `
        <a href="${page.slug}" class="sidebar-link ${page.slug === currentSlug ? 'active' : ''}">
          ${page.title}
        </a>
      `).join('')}
    </div>`;
  }
  return html;
}

// Generate TOC HTML
function generateTOC(htmlContent) {
  const headings = [];
  const renderer = new marked.Renderer();
  const originalHeading = renderer.heading;
  
  // We need to re-parse or regex the HTML to find headings, 
  // but marked renderer is easier if we hook into the compilation.
  // For simplicity here, let's just use regex on the generated HTML
  const regex = /<h([2-3]) id="([^"]+)">([^<]+)<\/h\1>/g;
  let match;
  
  while ((match = regex.exec(htmlContent)) !== null) {
    headings.push({
      level: match[1],
      id: match[2],
      text: match[3]
    });
  }
  
  return headings.map(h => `
    <li><a href="#${h.id}">${h.text}</a></li>
  `).join('');
}

// Custom Renderer for IDs
const renderer = new marked.Renderer();
renderer.heading = function({ tokens, depth, text, raw }) {
  // In newer marked versions, the first arg is an object
  const headingText = this.parser.parseInline(tokens);
  const escapedText = headingText.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${depth} id="${escapedText}">${headingText}</h${depth}>`;
};

// Build Pages
pages.forEach((page, index) => {
  console.log(`Building ${page.filename}...`);
  
  const htmlContent = marked.parse(page.body, { renderer });
  const sidebarHtml = generateSidebar(page.slug);
  const tocHtml = generateTOC(htmlContent);
  
  // Footer Nav
  const prevPage = pages[index - 1];
  const nextPage = pages[index + 1];
  
  let footerNavHtml = '';
  if (prevPage) {
    footerNavHtml += `
      <a href="${prevPage.slug}" class="nav-card">
        <div class="nav-card-label">Previous</div>
        <div class="nav-card-title">← ${prevPage.title}</div>
      </a>
    `;
  } else {
    footerNavHtml += '<div></div>'; // Spacer
  }
  
  if (nextPage) {
    footerNavHtml += `
      <a href="${nextPage.slug}" class="nav-card" style="text-align: right">
        <div class="nav-card-label">Next</div>
        <div class="nav-card-title">${nextPage.title} →</div>
      </a>
    `;
  }

  // Inject into Template
  let output = template
    .replace('{{title}}', page.title)
    .replace('{{group}}', page.group)
    .replace('{{sidebar}}', sidebarHtml)
    .replace('{{content}}', htmlContent)
    .replace('{{toc}}', tocHtml)
    .replace('{{footerNav}}', footerNavHtml);
    
  fs.writeFileSync(path.join(DIST_DIR, page.slug), output);
});

// Create index.html redirect if needed, or just copy the first page
if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  // If index.md exists, it's already built as index.html
  // If not, copy the first page to index.html
  if (!pages.find(p => p.slug === 'index.html') && pages.length > 0) {
    fs.copyFileSync(path.join(DIST_DIR, pages[0].slug), path.join(DIST_DIR, 'index.html'));
  }
}

// Generate Search Index
const searchIndex = pages.map(page => {
  // Strip HTML/Markdown to get plain text for search
  const plainText = page.body
    .replace(/#+\s/g, '') // Remove headers
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
    .replace(/[*_`]/g, '') // Remove formatting
    .replace(/\n+/g, ' ') // Collapse whitespace
    .trim();

  return {
    title: page.title,
    slug: page.slug,
    content: plainText
  };
});

fs.writeFileSync(path.join(DIST_DIR, 'search.json'), JSON.stringify(searchIndex));

console.log('Build complete! Output in dist/');
