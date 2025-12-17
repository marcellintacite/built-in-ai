document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let searchIndex = [];

  // Fetch search index
  fetch('search.json')
    .then(response => response.json())
    .then(data => {
      searchIndex = data;
    })
    .catch(error => console.error('Error loading search index:', error));

  // Search logic
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }

    const results = searchIndex.filter(page => {
      return page.title.toLowerCase().includes(query) || 
             page.content.toLowerCase().includes(query);
    });

    renderResults(results);
  });

  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });

  // Focus shortcut
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  function renderResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
      searchResults.innerHTML = results.slice(0, 5).map(result => `
        <a href="${result.slug}" class="search-result-item">
          <div class="search-result-title">${result.title}</div>
          <div class="search-result-preview">${getPreview(result.content, searchInput.value)}</div>
        </a>
      `).join('');
    }
    searchResults.style.display = 'block';
  }

  function getPreview(content, query) {
    const lowerContent = content.toLowerCase();
    const index = lowerContent.indexOf(query.toLowerCase());
    if (index === -1) return content.substring(0, 60) + '...';
    
    const start = Math.max(0, index - 20);
    const end = Math.min(content.length, index + query.length + 40);
    return '...' + content.substring(start, end) + '...';
  }
});
