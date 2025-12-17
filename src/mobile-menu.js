document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.createElement('div');
  
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close when clicking a link in the sidebar
  sidebar.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      closeMenu();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
});
